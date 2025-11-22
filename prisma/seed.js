const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // delete all existing records
  await prisma.smallOrder.deleteMany();
  await prisma.cart.deleteMany();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
