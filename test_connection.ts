import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Testing connection to Neon...");
    try {
        const count = await prisma.data_entry_proyecto.count();
        console.log(`Connection successful. Current projects in Neon: ${count}`);
    } catch (err) {
        console.error("Connection failed!");
        console.error(err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
