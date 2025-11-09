import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // --- 1. User ---

  // --- 7. Supply ---
  const user1 = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "password123",
      role: "admin",
      phone: "1234567890",
      address: "123 Main St",
      salary: 5000,
      bonus: 500,
      attendance: 20,
      performanceRating: 9,
      status: "active",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Bob Smith",
      email: "bob@example.com",
      password: "password456",
      role: "staff",
      phone: "0987654321",
      address: "456 Elm St",
      salary: 3500,
      bonus: 200,
      attendance: 18,
      performanceRating: 8,
    },
  });

  // --- 2. Products ---
  const product1 = await prisma.product.create({
    data: {
      name: "Laptop",
      sku: "PROD-001",
      description: "High performance laptop",
      category: "Electronics",
      price: 1200.0,
      quantity: 10,
      minStock: 2,
      maxStock: 20,
      location: "Warehouse A",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Office Chair",
      sku: "PROD-002",
      category: "Furniture",
      price: 150.0,
      quantity: 50,
      location: "Warehouse B",
    },
  });

  // --- 3. Supply ---
  const supply1 = await prisma.supply.create({
    data: {
      name: "Packaging Tape",
      sku: "SUP-001",
      category: "Office Supplies",
      stock: 200,
      price: 250,
    },
  });

  // --- 4. Task ---
  const task1 = await prisma.task.create({
    data: {
      title: "Inventory Audit",
      description: "Check warehouse inventory",
      assigneeId: user2.id,
      assignerId: user1.id,
      dueDate: new Date("2025-11-15"),
      priority: "high",
    },
  });

  // --- 5. Customer Feedback ---
  const feedback1 = await prisma.customerFeedback.create({
    data: {
      customerId: 1,
      orderId: 1,
      rating: 5,
      comment: "Excellent service",
      category: "Delivery",
      status: "new",
    },
  });

  // --- 6. Order ---
  const order1 = await prisma.order.create({
    data: {
      customerId: 1,
      orderDate: new Date("2025-11-01"),
      status: "pending",
      totalAmount: 1350.0,
      dueDate: new Date("2025-11-10"),
      itemIDs: [product1.id, product2.id],
      items: [
        { id: product1.id, name: "Laptop", quantity: 1, price: 1200.0 },
        { id: product2.id, name: "Office Chair", quantity: 1, price: 150.0 },
      ],
    },
  });

  // --- 7. Delivery ---
  const delivery1 = await prisma.delivery.create({
    data: {
      deliveryNumber: "DEL-001",
      orderId: order1.id,
      driverId: user2.id,
      vehicleId: 101,
      deliveryAddress: "123 Customer St",
      scheduledDate: new Date("2025-11-05"),
      deliveredDate: new Date("2025-11-06"),
      estimatedTime: 120,
      status: "delivered",
      signature: "Signed by customer",
      proofOfDelivery: "photo.jpg",
      notes: "Left at front desk",
    },
  });

  // --- 8. Invoice ---
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-001",
      purchaseOrderId: order1.id,
      supplierId: user1.id,
      invoiceDate: new Date("2025-11-02"),
      dueDate: new Date("2025-11-12"),
      totalAmount: 1350.0,
      paidAmount: 1350.0,
      balance: 0.0,
      status: "paid",
    },
  });

  // --- 9. Shipment ---
  const shipment1 = await prisma.shipment.create({
    data: {
      shipmentNumber: "SHIP-001",
      purchaseOrderId: order1.id,
      supplierId: user1.id,
      shipmentDate: new Date("2025-11-03"),
      expectedDeliveryDate: new Date("2025-11-10"),
      actualDeliveryDate: new Date("2025-11-09"),
      trackingNumber: "TRK-001",
      carrier: "DHL",
      status: "in_transit",
      notes: "Handle with care",
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
