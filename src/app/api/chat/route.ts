import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { NextRequest, NextResponse } from "next/server";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { StreamingTextResponse } from "ai";
import db from "@/lib/db/prisma";

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    //validate body
    const { chatId, message } = SendMessageValidator.parse(body);

    const chat = await db.chat.findUnique({
        where: {
            id: chatId,
        },
        include: { condition: true, messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const {condition, messages: messageHistory } = chat;

    //save message to db
    const dbUserMessage = await db.message.create({
        data: {
            content: message,
            role: "user",
            chatId: chatId,
        },
    });

    const systemMessage = new SystemMessage(
        condition.prompt
    );

    const formattedHistory = messageHistory.map(({ content, role }) => {
        if (role === "assistant") {
            return new AIMessage(content);
        }
        return new HumanMessage(content);
    });

    //all messages combined (system, history, new message)
    const messages = [systemMessage, ...formattedHistory, new HumanMessage(message)];

    const prompt = ChatPromptTemplate.fromMessages(messages);

    //update the mode here with a different model
    //model right now is OpenAI
    const model = new ChatOpenAI({
        temperature: 0.7,
        maxTokens: 300,
        modelName: "gpt-4o",
    });
    
     console.log(model)

    const outputParser = new BytesOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream(message, {
        callbacks: [
            {
                async handleLLMEnd(output) {
                    const aiResponse = output.generations[0][0].text;

                    //save AI message to DB
                    const dbMessage = await db.message.create({
                        data: {
                            content: aiResponse,
                            role: "assistant",
                            chatId: chatId,
                        },
                    });
                },
            },
        ],
    });

    return new StreamingTextResponse(stream);
};
