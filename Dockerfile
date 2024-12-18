# Base image with Node.js
FROM node:20-alpine AS base

# Install system dependencies (if any)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./src/lib/db ./src/lib/db

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Re-define ARGs to make them available in this stage
ARG OPENAI_API_KEY
ARG DATABASE_URL
ARG LANGCHAIN_TRACING_V2
ARG LANGCHAIN_ENDPOINT
ARG LANGSMITH_API_KEY
ARG LANGCHAIN_API_KEY
ARG LANGCHAIN_PROJECT

# Set ARGs as ENV variables for the build process
ENV OPENAI_API_KEY=$OPENAI_API_KEY \
    DATABASE_URL=$DATABASE_URL \
    LANGCHAIN_TRACING_V2=$LANGCHAIN_TRACING_V2 \
    LANGCHAIN_ENDPOINT=$LANGCHAIN_ENDPOINT \
    LANGSMITH_API_KEY=$LANGSMITH_API_KEY \
    LANGCHAIN_API_KEY=$LANGCHAIN_API_KEY \
    LANGCHAIN_PROJECT=$LANGCHAIN_PROJECT \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# The build script can use the environment variables above
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image: Copy all the files and run the server
FROM base AS runner
WORKDIR /app

# Re-define ARGs to make them available in this stage
ARG OPENAI_API_KEY
ARG DATABASE_URL
ARG LANGCHAIN_TRACING_V2
ARG LANGCHAIN_ENDPOINT
ARG LANGSMITH_API_KEY
ARG LANGCHAIN_API_KEY
ARG LANGCHAIN_PROJECT

# Environment variables for runtime
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=localhost \
    OPENAI_API_KEY=$OPENAI_API_KEY \
    DATABASE_URL=$DATABASE_URL \
    LANGCHAIN_TRACING_V2=$LANGCHAIN_TRACING_V2 \
    LANGCHAIN_ENDPOINT=$LANGCHAIN_ENDPOINT \
    LANGSMITH_API_KEY=$LANGSMITH_API_KEY \
    LANGCHAIN_API_KEY=$LANGCHAIN_API_KEY \
    LANGCHAIN_PROJECT=$LANGCHAIN_PROJECT \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]