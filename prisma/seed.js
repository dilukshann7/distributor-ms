const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (order matters due to foreign keys)
  await prisma.smallOrder.deleteMany();
  await prisma.cart.deleteMany();

  // Seed Carts
  const cart1 = await prisma.cart.create({
    data: {
      items: [
        {
          productId: 6,
          productName: "Premium Widget A",
          quantity: 2,
          unitPrice: 299.99,
          total: 599.98,
        },
        {
          productId: 7,
          productName: "Industrial Gadget X",
          quantity: 1,
          unitPrice: 799.99,
          total: 799.99,
        },
      ],
      totalAmount: 1399.97,
      status: "active",
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      items: [
        {
          productId: 12,
          productName: "Smart Device Pro",
          quantity: 3,
          unitPrice: 149.99,
          total: 449.97,
        },
        {
          productId: 15,
          productName: "Wireless Headphones",
          quantity: 1,
          unitPrice: 89.99,
          total: 89.99,
        },
      ],
      totalAmount: 539.96,
      status: "active",
    },
  });

  const cart3 = await prisma.cart.create({
    data: {
      items: [
        {
          productId: 20,
          productName: "Laptop Stand",
          quantity: 1,
          unitPrice: 45.5,
          total: 45.5,
        },
      ],
      totalAmount: 45.5,
      status: "completed",
    },
  });

  // Seed SmallOrders - now using cartId correctly
  const order1 = await prisma.smallOrder.create({
    data: {
      orderNumber: "ORD-2025-001",
      cartId: cart3.id, // This now correctly references the cart
      status: "completed",
      paymentMethod: "credit_card",
    },
  });

  const order2 = await prisma.smallOrder.create({
    data: {
      orderNumber: "ORD-2025-002",
      cartId: cart1.id, // This now correctly references the cart
      status: "pending",
      paymentMethod: "cash",
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
