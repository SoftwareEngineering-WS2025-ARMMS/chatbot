import db from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export type ICondition = Prisma.PromiseReturnType<typeof findCondition>;

export const findCondition = async () =>
    await db.condition.findUniqueOrThrow({
        where: { id: "1" },
    });
