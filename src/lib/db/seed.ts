import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const conditions = await prisma.condition.create({
        data: {
            id: "2e6de55c-b316-47d9-9346-d2f277239b7b",
            name: "exampleCondition",
            description: "This is an example condition",
            startScreenTitle: "Example Start Screen Title",
            startScreenMessage: "To edit this message, open prisma studio and edit the 'condition' table",
            prompt: "You are a helpful Assistant.",
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
