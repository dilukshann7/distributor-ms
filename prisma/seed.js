import { PrismaClient } from "../src/generated/prisma/client.ts";
import "dotenv/config";

const prisma = new PrismaClient();

async function main(params) {
  //Prisma Queries can be added here if needed
  // const user = await prisma.user.create({
  //   data: {
  //     name: "John Doe",
  //     email: "john@email.com",
  //     password: "password",
  //     role: "manager",
  //   },
  // });

  const users = await prisma.user.findMany();
  console.log(users);
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
