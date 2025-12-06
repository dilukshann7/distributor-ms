const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // delete all existing records
  await prisma.smallOrder.deleteMany();
  await prisma.cart.deleteMany();

  // Create an order with supplier ID 4
  const order = await prisma.order.create({
    data: {
      supplierId: 1,
      orderDate: new Date(),
      status: "pending",
      totalAmount: 2500.0,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      items: [
        {
          productId: 1,
          productName: "Sample Product A",
          sku: "PROD-001",
          quantity: 20,
          unitPrice: 75.0,
          total: 1500.0,
        },
        {
          productId: 2,
          productName: "Sample Product B",
          sku: "PROD-002",
          quantity: 10,
          unitPrice: 100.0,
          total: 1000.0,
        },
      ],
    },
  });

  console.log("Order created successfully:", order);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
