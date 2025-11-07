import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(params) {
  //Prisma Queries can be added here if needed
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
