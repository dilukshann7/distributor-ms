// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to preserve data)
  await prisma.salesInvoice.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.customerFeedback.deleteMany();
  await prisma.task.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  console.log("👥 Creating users...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Manager",
        email: "john.manager@company.com",
        password: "$2a$10$abcdefghijklmnopqrstuv", // hashed password
        role: "manager",
        phone: "+1234567890",
        address: "123 Main St, City",
        salary: 75000,
        bonus: 5000,
        attendance: 95,
        performanceRating: 9,
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Sales",
        email: "sarah.sales@company.com",
        password: "$2a$10$abcdefghijklmnopqrstuv",
        role: "salesperson",
        phone: "+1234567891",
        address: "456 Oak Ave, City",
        salary: 50000,
        bonus: 3000,
        attendance: 92,
        performanceRating: 8,
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Mike Warehouse",
        email: "mike.warehouse@company.com",
        password: "$2a$10$abcdefghijklmnopqrstuv",
        role: "warehouse",
        phone: "+1234567892",
        address: "789 Elm St, City",
        salary: 40000,
        bonus: 1500,
        attendance: 88,
        performanceRating: 7,
        status: "active",
      },
    }),
  ]);

  // 2. Create Customers
  console.log("🛒 Creating customers...");
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+1555123456",
        address: "100 Business Park, Metro City",
        businessName: "Acme Corp",
        customerType: "business",
        isVIP: true,
        totalPurchases: 45,
        totalSpent: 125000.5,
        lastVisit: new Date("2025-11-08"),
        loyaltyPoints: 1250,
        status: "active",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Jane Retail",
        email: "jane@email.com",
        phone: "+1555123457",
        address: "202 Residential St, Suburb",
        customerType: "individual",
        isVIP: false,
        totalPurchases: 12,
        totalSpent: 8500.0,
        lastVisit: new Date("2025-11-05"),
        loyaltyPoints: 85,
        status: "active",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Global Retail Inc",
        email: "orders@globalretail.com",
        phone: "+1555123458",
        address: "500 Commerce Blvd, Downtown",
        businessName: "Global Retail Inc",
        customerType: "business",
        isVIP: true,
        totalPurchases: 78,
        totalSpent: 285000.0,
        lastVisit: new Date("2025-11-07"),
        loyaltyPoints: 2850,
        status: "active",
      },
    }),
  ]);

  // 3. Create Products
  console.log("📦 Creating products...");
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Premium Widget A",
        sku: "WDG-A-001",
        description: "High-quality widget with advanced features",
        category: "Electronics",
        price: 299.99,
        quantity: 150,
        minStock: 20,
        maxStock: 500,
        location: "Warehouse A - Shelf 12",
        supplierId: 1001,
        batchNumber: "BATCH-2025-001",
        expiryDate: new Date("2026-12-31"),
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Standard Widget B",
        sku: "WDG-B-002",
        description: "Reliable standard widget",
        category: "Electronics",
        price: 149.99,
        quantity: 320,
        minStock: 50,
        maxStock: 800,
        location: "Warehouse A - Shelf 13",
        supplierId: 1001,
        batchNumber: "BATCH-2025-002",
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Industrial Gadget X",
        sku: "GDG-X-003",
        description: "Heavy-duty industrial gadget",
        category: "Industrial",
        price: 799.99,
        quantity: 45,
        minStock: 10,
        maxStock: 100,
        location: "Warehouse B - Section 5",
        supplierId: 1002,
        batchNumber: "BATCH-2025-003",
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Compact Tool Y",
        sku: "TOOL-Y-004",
        description: "Versatile compact tool for multiple uses",
        category: "Tools",
        price: 89.99,
        quantity: 500,
        minStock: 100,
        maxStock: 1000,
        location: "Warehouse A - Shelf 8",
        supplierId: 1003,
        batchNumber: "BATCH-2025-004",
        status: "active",
      },
    }),
  ]);

  // 4. Create Drivers
  console.log("🚚 Creating drivers...");
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: "Tom Driver",
        vehicleId: "VEH-001",
        vehicleType: "Van",
        licenseNumber: "DL123456",
        phone: "+1555200001",
        email: "tom.driver@company.com",
        currentLocation: "Warehouse District",
        status: "active",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Lisa Transport",
        vehicleId: "VEH-002",
        vehicleType: "Truck",
        licenseNumber: "DL123457",
        phone: "+1555200002",
        email: "lisa.transport@company.com",
        currentLocation: "Downtown Hub",
        status: "active",
      },
    }),
  ]);

  // 5. Create Deliveries
  console.log("📍 Creating deliveries...");
  const deliveries = await Promise.all([
    prisma.delivery.create({
      data: {
        deliveryNumber: "DEL-2025-001",
        driverId: drivers[0].id,
        vehicleId: 1,
        deliveryAddress: "100 Business Park, Metro City",
        scheduledDate: new Date("2025-11-10"),
        estimatedTime: 45,
        status: "scheduled",
        notes: "Handle with care - fragile items",
      },
    }),
    prisma.delivery.create({
      data: {
        deliveryNumber: "DEL-2025-002",
        driverId: drivers[1].id,
        vehicleId: 2,
        deliveryAddress: "500 Commerce Blvd, Downtown",
        scheduledDate: new Date("2025-11-09"),
        deliveredDate: new Date("2025-11-09T14:30:00"),
        estimatedTime: 60,
        status: "delivered",
        signature: "John Doe",
        proofOfDelivery: "POD-IMG-001.jpg",
        notes: "Delivered to reception",
      },
    }),
  ]);

  // 6. Create Sales Orders
  console.log("💰 Creating sales orders...");
  const salesOrders = await Promise.all([
    prisma.salesOrder.create({
      data: {
        orderNumber: "SO-2025-001",
        customerId: customers[0].id,
        customerName: customers[0].name,
        salesmanId: users[1].id,
        orderDate: new Date("2025-11-08"),
        subtotal: 2999.9,
        tax: 299.99,
        discount: 150.0,
        totalAmount: 3149.89,
        status: "confirmed",
        paymentStatus: "paid",
        deliveryId: deliveries[1].id,
        items: [
          {
            productId: products[0].id,
            productName: products[0].name,
            sku: products[0].sku,
            quantity: 10,
            unitPrice: 299.99,
            total: 2999.9,
          },
        ],
        notes: "Rush order - VIP customer",
      },
    }),
    prisma.salesOrder.create({
      data: {
        orderNumber: "SO-2025-002",
        customerId: customers[2].id,
        customerName: customers[2].name,
        salesmanId: users[1].id,
        orderDate: new Date("2025-11-09"),
        subtotal: 4799.85,
        tax: 479.99,
        discount: 200.0,
        totalAmount: 5079.84,
        status: "pending",
        paymentStatus: "unpaid",
        deliveryId: deliveries[0].id,
        items: [
          {
            productId: products[2].id,
            productName: products[2].name,
            sku: products[2].sku,
            quantity: 6,
            unitPrice: 799.99,
            total: 4799.94,
          },
        ],
        notes: "Awaiting payment confirmation",
      },
    }),
  ]);

  // 7. Create Purchase Orders
  console.log("📋 Creating purchase orders...");
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerId: 2001,
        orderDate: new Date("2025-10-15"),
        status: "completed",
        totalAmount: 15000.0,
        dueDate: new Date("2025-11-15"),
        itemIDs: [1, 2, 3],
        items: [
          { itemId: 1, name: "Component A", quantity: 100, price: 50.0 },
          { itemId: 2, name: "Component B", quantity: 200, price: 25.0 },
          { itemId: 3, name: "Component C", quantity: 50, price: 100.0 },
        ],
      },
    }),
    prisma.order.create({
      data: {
        customerId: 2002,
        orderDate: new Date("2025-11-01"),
        status: "pending",
        totalAmount: 8500.0,
        dueDate: new Date("2025-12-01"),
        itemIDs: [4, 5],
        items: [
          { itemId: 4, name: "Part X", quantity: 50, price: 100.0 },
          { itemId: 5, name: "Part Y", quantity: 70, price: 50.0 },
        ],
      },
    }),
  ]);

  // 8. Create Supplies
  console.log("🔧 Creating supplies...");
  await Promise.all([
    prisma.supply.create({
      data: {
        name: "Packaging Material",
        sku: "SUP-PKG-001",
        category: "Packaging",
        stock: 5000,
        price: 0.5,
        status: "available",
      },
    }),
    prisma.supply.create({
      data: {
        name: "Shipping Labels",
        sku: "SUP-LBL-002",
        category: "Shipping",
        stock: 10000,
        price: 0.1,
        status: "available",
      },
    }),
    prisma.supply.create({
      data: {
        name: "Bubble Wrap Roll",
        sku: "SUP-BWR-003",
        category: "Packaging",
        stock: 200,
        price: 15.0,
        status: "available",
      },
    }),
  ]);

  // 9. Create Invoices
  console.log("🧾 Creating invoices...");
  await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2025-001",
        purchaseOrderId: orders[0].id,
        supplierId: 2001,
        invoiceDate: new Date("2025-10-20"),
        dueDate: new Date("2025-11-20"),
        paidDate: new Date("2025-11-05"),
        totalAmount: 15000.0,
        paidAmount: 15000.0,
        balance: 0.0,
        status: "paid",
        notes: "Payment received via wire transfer",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2025-002",
        purchaseOrderId: orders[1].id,
        supplierId: 2002,
        invoiceDate: new Date("2025-11-05"),
        dueDate: new Date("2025-12-05"),
        totalAmount: 8500.0,
        paidAmount: 0.0,
        balance: 8500.0,
        status: "pending",
        notes: "Awaiting payment",
      },
    }),
  ]);

  // 10. Create Shipments
  console.log("🚢 Creating shipments...");
  await Promise.all([
    prisma.shipment.create({
      data: {
        shipmentNumber: "SHP-2025-001",
        purchaseOrderId: orders[0].id,
        supplierId: 2001,
        shipmentDate: new Date("2025-10-18"),
        expectedDeliveryDate: new Date("2025-10-25"),
        actualDeliveryDate: new Date("2025-10-24"),
        trackingNumber: "TRK123456789",
        carrier: "FastShip Logistics",
        status: "delivered",
        notes: "All items received in good condition",
      },
    }),
    prisma.shipment.create({
      data: {
        shipmentNumber: "SHP-2025-002",
        purchaseOrderId: orders[1].id,
        supplierId: 2002,
        shipmentDate: new Date("2025-11-03"),
        expectedDeliveryDate: new Date("2025-11-10"),
        actualDeliveryDate: new Date("2025-11-10"),
        trackingNumber: "TRK987654321",
        carrier: "QuickMove Express",
        status: "in_transit",
        notes: "Expected delivery tomorrow",
      },
    }),
  ]);

  // 11. Create Sales Invoices
  console.log("💳 Creating sales invoices...");
  await Promise.all([
    prisma.salesInvoice.create({
      data: {
        invoiceNumber: "SINV-2025-001",
        customerId: customers[0].id,
        salesOrderId: salesOrders[0].id,
        deliveryId: deliveries[1].id,
        date: new Date("2025-11-09"),
        paymentMethod: "credit_card",
        items: [
          {
            productId: products[0].id,
            productName: products[0].name,
            quantity: 10,
            unitPrice: 299.99,
            total: 2999.9,
          },
        ],
        subtotal: 2999.9,
        collectedAmount: 3149.89,
        collectedAt: new Date("2025-11-09T15:00:00"),
        status: "paid",
      },
    }),
    prisma.salesInvoice.create({
      data: {
        invoiceNumber: "SINV-2025-002",
        customerId: customers[2].id,
        salesOrderId: salesOrders[1].id,
        deliveryId: deliveries[0].id,
        date: new Date("2025-11-09"),
        paymentMethod: "bank_transfer",
        items: [
          {
            productId: products[2].id,
            productName: products[2].name,
            quantity: 6,
            unitPrice: 799.99,
            total: 4799.94,
          },
        ],
        subtotal: 4799.85,
        collectedAmount: 0.0,
        status: "pending",
      },
    }),
  ]);

  // 12. Create Tasks
  console.log("✅ Creating tasks...");
  await Promise.all([
    prisma.task.create({
      data: {
        title: "Process incoming shipment SHP-2025-002",
        description: "Receive and inspect items from QuickMove Express",
        assigneeId: users[2].id,
        assignerId: users[0].id,
        dueDate: new Date("2025-11-10"),
        priority: "high",
        status: "in_progress",
        notes: "Verify quantities match purchase order",
      },
    }),
    prisma.task.create({
      data: {
        title: "Follow up with Global Retail Inc payment",
        description:
          "Contact customer regarding pending payment for SO-2025-002",
        assigneeId: users[1].id,
        assignerId: users[0].id,
        dueDate: new Date("2025-11-11"),
        priority: "medium",
        status: "pending",
        notes: "Send payment reminder email",
      },
    }),
    prisma.task.create({
      data: {
        title: "Inventory audit for Warehouse A",
        description: "Conduct monthly inventory count for all products",
        assigneeId: users[2].id,
        assignerId: users[0].id,
        dueDate: new Date("2025-11-15"),
        priority: "low",
        status: "pending",
        notes: "Focus on high-value items first",
      },
    }),
  ]);

  // 13. Create Customer Feedback
  console.log("⭐ Creating customer feedback...");
  await Promise.all([
    prisma.customerFeedback.create({
      data: {
        customerId: customers[0].id,
        orderId: salesOrders[0].id,
        rating: 5,
        comment:
          "Excellent service! Products arrived on time and in perfect condition.",
        category: "delivery",
        status: "resolved",
        response: "Thank you for your feedback! We're glad you're satisfied.",
        respondedBy: users[0].id,
        respondedAt: new Date("2025-11-09T16:00:00"),
      },
    }),
    prisma.customerFeedback.create({
      data: {
        customerId: customers[1].id,
        orderId: 1002,
        rating: 3,
        comment: "Product quality is good but delivery was delayed by 2 days.",
        category: "delivery",
        status: "new",
      },
    }),
    prisma.customerFeedback.create({
      data: {
        customerId: customers[2].id,
        orderId: salesOrders[1].id,
        rating: 4,
        comment: "Great products, would like more color options.",
        category: "product",
        status: "new",
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`   - ${users.length} users created`);
  console.log(`   - ${customers.length} customers created`);
  console.log(`   - ${products.length} products created`);
  console.log(`   - ${drivers.length} drivers created`);
  console.log(`   - ${deliveries.length} deliveries created`);
  console.log(`   - ${salesOrders.length} sales orders created`);
  console.log(`   - And more...`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
