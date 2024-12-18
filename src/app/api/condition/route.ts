import { NextResponse } from "next/server";
import db from "@/lib/db/prisma";

export const GET = async (req: Request) => {
    const conditions = await db.condition.findMany();
    return NextResponse.json(conditions);
};

//create a new condition
export const POST = async (req: Request) => {
    const { name, description, prompt } = await req.json();

    const condition = await db.condition.create({
        data: {
            name,
            description,
            prompt,
        },
    });

    return NextResponse.json(condition);
};
