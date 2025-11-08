import { PrismaClient } from "../src/generated/prisma/client.ts";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // --- 1. User ---

  // --- 7. Supply ---
  const supply = await prisma.supply.create({
    data: {
      name: "Packaging Tape2",
      sku: "SUP-002",
      category: "Office Supplies2",
      stock: 2020,
      price: 250.0,
      status: "available",
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
