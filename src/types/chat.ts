import db from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export type IChat = Prisma.PromiseReturnType<typeof createChat>;

export const createChat = async (conditionId: string, responseId?: string) =>
    await db.chat.create({
        data: {
            conditionId: conditionId,
            responseId: responseId,
        },
        include: { messages: true, condition: true},
    });
