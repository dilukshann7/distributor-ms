// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data in correct order (respecting foreign keys)
  await prisma.salesOrder.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customerFeedback.deleteMany();
  await prisma.task.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Admin",
        email: "john.admin@company.com",
        password: "$2b$10$hash1",
        role: "admin",
        phone: "+94771234567",
        address: "123 Main St, Ratnapura",
        salary: 150000,
        bonus: 15000,
        attendance: 95,
        performanceRating: 5,
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Manager",
        email: "sarah.manager@company.com",
        password: "$2b$10$hash2",
        role: "manager",
        phone: "+94772345678",
        address: "456 Oak Ave, Ratnapura",
        salary: 120000,
        bonus: 12000,
        attendance: 92,
        performanceRating: 4,
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Mike Sales",
        email: "mike.sales@company.com",
        password: "$2b$10$hash3",
        role: "salesman",
        phone: "+94773456789",
        address: "789 Pine Rd, Ratnapura",
        salary: 80000,
        bonus: 8000,
        attendance: 88,
        performanceRating: 4,
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "Emma Warehouse",
        email: "emma.warehouse@company.com",
        password: "$2b$10$hash4",
        role: "warehouse_staff",
        phone: "+94774567890",
        address: "321 Elm St, Ratnapura",
        salary: 60000,
        bonus: 5000,
        attendance: 90,
        performanceRating: 4,
        status: "active",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Support",
        email: "david.support@company.com",
        password: "$2b$10$hash5",
        role: "support",
        phone: "+94775678901",
        address: "654 Birch Ln, Ratnapura",
        salary: 55000,
        bonus: 4000,
        attendance: 87,
        performanceRating: 3,
        status: "active",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Seed Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+94711111111",
        address: "100 Business Park, Colombo",
        businessName: "Acme Corp (Pvt) Ltd",
        customerType: "wholesale",
        isVIP: true,
        totalPurchases: 45,
        totalSpent: 2500000,
        lastVisit: new Date("2025-11-05"),
        loyaltyPoints: 2500,
        status: "active",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Tech Solutions Ltd",
        email: "info@techsolutions.lk",
        phone: "+94712222222",
        address: "250 Tech Tower, Kandy",
        businessName: "Tech Solutions (Pvt) Ltd",
        customerType: "wholesale",
        isVIP: true,
        totalPurchases: 38,
        totalSpent: 1800000,
        lastVisit: new Date("2025-11-07"),
        loyaltyPoints: 1800,
        status: "active",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Kamal Perera",
        email: "kamal.perera@email.com",
        phone: "+94713333333",
        address: "45 Lake View, Galle",
        customerType: "retail",
        isVIP: false,
        totalPurchases: 12,
        totalSpent: 450000,
        lastVisit: new Date("2025-11-08"),
        loyaltyPoints: 450,
        status: "active",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Nimal Silva",
        email: "nimal.silva@email.com",
        phone: "+94714444444",
        address: "78 Hill Street, Matara",
        customerType: "retail",
        isVIP: false,
        totalPurchases: 8,
        totalSpent: 320000,
        lastVisit: new Date("2025-11-06"),
        loyaltyPoints: 320,
        status: "active",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Global Traders",
        email: "sales@globaltraders.lk",
        phone: "+94715555555",
        address: "500 Commerce Center, Negombo",
        businessName: "Global Traders International",
        customerType: "wholesale",
        isVIP: true,
        totalPurchases: 52,
        totalSpent: 3200000,
        lastVisit: new Date("2025-11-09"),
        loyaltyPoints: 3200,
        status: "active",
      },
    }),
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // Seed Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Rice - Basmati Premium",
        sku: "RICE-BSM-001",
        description: "Premium quality Basmati rice imported from India",
        category: "Food & Beverages",
        price: 850,
        quantity: 500,
        minStock: 100,
        maxStock: 1000,
        location: "Warehouse A - Shelf 1",
        supplierId: 1,
        batchNumber: "BTH-2025-001",
        expiryDate: new Date("2026-11-01"),
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Coconut Oil - 1L",
        sku: "OIL-COC-001",
        description: "Pure coconut oil, locally sourced",
        category: "Food & Beverages",
        price: 650,
        quantity: 300,
        minStock: 50,
        maxStock: 500,
        location: "Warehouse A - Shelf 2",
        supplierId: 2,
        batchNumber: "BTH-2025-002",
        expiryDate: new Date("2026-05-15"),
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "LED TV 43 inch",
        sku: "ELEC-TV-043",
        description: "Smart LED TV with 4K resolution",
        category: "Electronics",
        price: 85000,
        quantity: 25,
        minStock: 5,
        maxStock: 50,
        location: "Warehouse B - Section 1",
        supplierId: 3,
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Laptop - Business Pro",
        sku: "ELEC-LPT-001",
        description: "Intel i7, 16GB RAM, 512GB SSD",
        category: "Electronics",
        price: 185000,
        quantity: 15,
        minStock: 3,
        maxStock: 30,
        location: "Warehouse B - Section 2",
        supplierId: 3,
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Dhal - Red Lentils",
        sku: "FOOD-DHL-001",
        description: "Red lentils, premium quality",
        category: "Food & Beverages",
        price: 320,
        quantity: 450,
        minStock: 100,
        maxStock: 800,
        location: "Warehouse A - Shelf 3",
        supplierId: 1,
        batchNumber: "BTH-2025-003",
        expiryDate: new Date("2026-08-20"),
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Office Chair - Ergonomic",
        sku: "FURN-CHR-001",
        description: "Ergonomic office chair with lumbar support",
        category: "Furniture",
        price: 25000,
        quantity: 40,
        minStock: 10,
        maxStock: 100,
        location: "Warehouse C - Zone 1",
        supplierId: 4,
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Smartphone - XPro Max",
        sku: "ELEC-PHN-001",
        description: "Latest smartphone with 128GB storage",
        category: "Electronics",
        price: 125000,
        quantity: 30,
        minStock: 5,
        maxStock: 50,
        location: "Warehouse B - Section 3",
        supplierId: 3,
        status: "active",
      },
    }),
    prisma.product.create({
      data: {
        name: "Tea - Ceylon Black",
        sku: "FOOD-TEA-001",
        description: "Premium Ceylon black tea, 500g pack",
        category: "Food & Beverages",
        price: 1200,
        quantity: 200,
        minStock: 50,
        maxStock: 400,
        location: "Warehouse A - Shelf 4",
        supplierId: 2,
        batchNumber: "BTH-2025-004",
        expiryDate: new Date("2027-01-10"),
        status: "active",
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Seed Supplies
  const supplies = await Promise.all([
    prisma.supply.create({
      data: {
        name: "Cardboard Boxes - Large",
        sku: "SUP-BOX-LRG",
        category: "Packaging",
        stock: 500,
        price: 150,
        status: "available",
      },
    }),
    prisma.supply.create({
      data: {
        name: "Bubble Wrap Roll",
        sku: "SUP-BWP-001",
        category: "Packaging",
        stock: 100,
        price: 850,
        status: "available",
      },
    }),
    prisma.supply.create({
      data: {
        name: "Packing Tape",
        sku: "SUP-TAPE-001",
        category: "Packaging",
        stock: 200,
        price: 120,
        status: "available",
      },
    }),
    prisma.supply.create({
      data: {
        name: "Pallet",
        sku: "SUP-PLT-001",
        category: "Warehouse",
        stock: 50,
        price: 2500,
        status: "available",
      },
    }),
  ]);

  console.log(`✅ Created ${supplies.length} supplies`);

  // Seed Drivers (NEW - must come before Deliveries)
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: "Sunil Fernando",
        vehicleId: "VEH-001",
        vehicleType: "Truck",
        licenseNumber: "LIC-2025-001",
        phone: "+94716666666",
        email: "sunil.driver@company.com",
        currentLocation: "Ratnapura Warehouse",
        status: "active",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Ranjith Kumara",
        vehicleId: "VEH-002",
        vehicleType: "Van",
        licenseNumber: "LIC-2025-002",
        phone: "+94717777777",
        email: "ranjith.driver@company.com",
        currentLocation: "Colombo",
        status: "active",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Prasanna Jayawardena",
        vehicleId: "VEH-003",
        vehicleType: "Truck",
        licenseNumber: "LIC-2025-003",
        phone: "+94718888888",
        email: "prasanna.driver@company.com",
        currentLocation: "Kandy",
        status: "active",
      },
    }),
  ]);

  console.log(`✅ Created ${drivers.length} drivers`);

  // Seed Deliveries (using the driver relation)
  const deliveries = await Promise.all([
    prisma.delivery.create({
      data: {
        deliveryNumber: "DEL-2025-001",
        driverId: drivers[0].id, // Link to driver
        vehicleId: 1,
        deliveryAddress: "100 Business Park, Colombo",
        scheduledDate: new Date("2025-11-10T09:00:00"),
        deliveredDate: new Date("2025-11-10T10:30:00"),
        estimatedTime: 120,
        status: "delivered",
        signature: "signature_url_1",
        proofOfDelivery: "pod_url_1",
        notes: "Delivered successfully",
      },
    }),
    prisma.delivery.create({
      data: {
        deliveryNumber: "DEL-2025-002",
        driverId: drivers[1].id, // Link to driver
        vehicleId: 2,
        deliveryAddress: "250 Tech Tower, Kandy",
        scheduledDate: new Date("2025-11-09T14:00:00"),
        estimatedTime: 180,
        status: "in_transit",
        notes: "On the way to destination",
      },
    }),
    prisma.delivery.create({
      data: {
        deliveryNumber: "DEL-2025-003",
        driverId: drivers[2].id, // Link to driver
        vehicleId: 3,
        deliveryAddress: "500 Commerce Center, Negombo",
        scheduledDate: new Date("2025-11-11T10:00:00"),
        estimatedTime: 150,
        status: "scheduled",
        notes: "Scheduled for tomorrow",
      },
    }),
  ]);

  console.log(`✅ Created ${deliveries.length} deliveries`);

  // Seed Sales Orders (linked to deliveries)
  const salesOrders = await Promise.all([
    prisma.salesOrder.create({
      data: {
        orderNumber: "SO-2025-001",
        customerId: customers[0].id,
        customerName: customers[0].name,
        salesmanId: users[2].id,
        orderDate: new Date("2025-11-08"),
        subtotal: 425000,
        tax: 63750,
        discount: 21250,
        totalAmount: 467500,
        status: "delivered",
        paymentStatus: "paid",
        deliveryId: deliveries[0].id, // Link to delivery
        items: [
          {
            productId: products[0].id,
            name: products[0].name,
            quantity: 50,
            price: 850,
          },
          {
            productId: products[2].id,
            name: products[2].name,
            quantity: 5,
            price: 85000,
          },
        ],
        notes: "VIP customer - priority delivery",
      },
    }),
    prisma.salesOrder.create({
      data: {
        orderNumber: "SO-2025-002",
        customerId: customers[1].id,
        customerName: customers[1].name,
        salesmanId: users[2].id,
        orderDate: new Date("2025-11-07"),
        subtotal: 195000,
        tax: 29250,
        discount: 9750,
        totalAmount: 214500,
        status: "in_transit",
        paymentStatus: "paid",
        deliveryId: deliveries[1].id, // Link to delivery
        items: [
          {
            productId: products[3].id,
            name: products[3].name,
            quantity: 1,
            price: 185000,
          },
          {
            productId: products[4].id,
            name: products[4].name,
            quantity: 10,
            price: 320,
          },
        ],
      },
    }),
    prisma.salesOrder.create({
      data: {
        orderNumber: "SO-2025-003",
        customerId: customers[4].id,
        customerName: customers[4].name,
        salesmanId: users[2].id,
        orderDate: new Date("2025-11-09"),
        subtotal: 385000,
        tax: 57750,
        discount: 19250,
        totalAmount: 423500,
        status: "processing",
        paymentStatus: "partial",
        deliveryId: deliveries[2].id, // Link to delivery
        items: [
          {
            productId: products[6].id,
            name: products[6].name,
            quantity: 3,
            price: 125000,
          },
          {
            productId: products[5].id,
            name: products[5].name,
            quantity: 2,
            price: 25000,
          },
        ],
        notes: "50% advance payment received",
      },
    }),
    prisma.salesOrder.create({
      data: {
        orderNumber: "SO-2025-004",
        customerId: customers[2].id,
        customerName: customers[2].name,
        salesmanId: users[2].id,
        orderDate: new Date("2025-11-09"),
        subtotal: 45500,
        tax: 6825,
        discount: 2275,
        totalAmount: 50050,
        status: "pending",
        paymentStatus: "unpaid",
        deliveryId: null, // No delivery assigned yet
        items: [
          {
            productId: products[1].id,
            name: products[1].name,
            quantity: 10,
            price: 650,
          },
          {
            productId: products[7].id,
            name: products[7].name,
            quantity: 5,
            price: 1200,
          },
        ],
      },
    }),
  ]);

  console.log(`✅ Created ${salesOrders.length} sales orders`);

  // Seed Orders (Purchase Orders)
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerId: customers[0].id,
        orderDate: new Date("2025-10-15"),
        status: "completed",
        totalAmount: 550000,
        dueDate: new Date("2025-10-30"),
        itemIDs: [products[0].id, products[1].id],
        items: [
          {
            productId: products[0].id,
            name: products[0].name,
            quantity: 100,
            price: 850,
          },
          {
            productId: products[1].id,
            name: products[1].name,
            quantity: 200,
            price: 650,
          },
        ],
      },
    }),
    prisma.order.create({
      data: {
        customerId: customers[1].id,
        orderDate: new Date("2025-10-20"),
        status: "completed",
        totalAmount: 425000,
        dueDate: new Date("2025-11-05"),
        itemIDs: [products[2].id, products[5].id],
        items: [
          {
            productId: products[2].id,
            name: products[2].name,
            quantity: 5,
            price: 85000,
          },
          {
            productId: products[5].id,
            name: products[5].name,
            quantity: 5,
            price: 25000,
          },
        ],
      },
    }),
    prisma.order.create({
      data: {
        customerId: customers[4].id,
        orderDate: new Date("2025-11-01"),
        status: "processing",
        totalAmount: 750000,
        dueDate: new Date("2025-11-20"),
        itemIDs: [products[3].id, products[6].id],
        items: [
          {
            productId: products[3].id,
            name: products[3].name,
            quantity: 3,
            price: 185000,
          },
          {
            productId: products[6].id,
            name: products[6].name,
            quantity: 2,
            price: 125000,
          },
        ],
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders`);

  // Continue with rest of seed data...
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2025-001",
        purchaseOrderId: orders[0].id,
        supplierId: 1,
        invoiceDate: new Date("2025-10-16"),
        dueDate: new Date("2025-10-30"),
        paidDate: new Date("2025-10-28"),
        totalAmount: 550000,
        paidAmount: 550000,
        balance: 0,
        status: "paid",
        notes: "Payment completed on time",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2025-002",
        purchaseOrderId: orders[1].id,
        supplierId: 3,
        invoiceDate: new Date("2025-10-21"),
        dueDate: new Date("2025-11-05"),
        paidDate: new Date("2025-11-03"),
        totalAmount: 425000,
        paidAmount: 425000,
        balance: 0,
        status: "paid",
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2025-003",
        purchaseOrderId: orders[2].id,
        supplierId: 3,
        invoiceDate: new Date("2025-11-02"),
        dueDate: new Date("2025-11-20"),
        totalAmount: 750000,
        paidAmount: 375000,
        balance: 375000,
        status: "partial",
        notes: "50% advance payment received",
      },
    }),
  ]);

  console.log(`✅ Created ${invoices.length} invoices`);

  const shipments = await Promise.all([
    prisma.shipment.create({
      data: {
        shipmentNumber: "SHIP-2025-001",
        purchaseOrderId: orders[0].id,
        supplierId: 1,
        shipmentDate: new Date("2025-10-17"),
        expectedDeliveryDate: new Date("2025-10-22"),
        actualDeliveryDate: new Date("2025-10-21"),
        trackingNumber: "TRK-001-2025",
        carrier: "Express Logistics",
        status: "delivered",
        notes: "Delivered ahead of schedule",
      },
    }),
    prisma.shipment.create({
      data: {
        shipmentNumber: "SHIP-2025-002",
        purchaseOrderId: orders[1].id,
        supplierId: 3,
        shipmentDate: new Date("2025-10-23"),
        expectedDeliveryDate: new Date("2025-10-28"),
        actualDeliveryDate: new Date("2025-10-28"),
        trackingNumber: "TRK-002-2025",
        carrier: "Fast Freight",
        status: "delivered",
      },
    }),
    prisma.shipment.create({
      data: {
        shipmentNumber: "SHIP-2025-003",
        purchaseOrderId: orders[2].id,
        supplierId: 3,
        shipmentDate: new Date("2025-11-05"),
        expectedDeliveryDate: new Date("2025-11-12"),
        actualDeliveryDate: new Date("2025-11-12"),
        trackingNumber: "TRK-003-2025",
        carrier: "Express Logistics",
        status: "in_transit",
        notes: "Expected delivery on schedule",
      },
    }),
  ]);

  console.log(`✅ Created ${shipments.length} shipments`);

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: "Review Q4 Inventory Levels",
        description: "Analyze current inventory and prepare reorder list",
        assigneeId: users[3].id,
        assignerId: users[1].id,
        dueDate: new Date("2025-11-15"),
        priority: "high",
        status: "in_progress",
        notes: "Focus on fast-moving items",
      },
    }),
    prisma.task.create({
      data: {
        title: "Follow up with VIP Customers",
        description: "Call all VIP customers for feedback and future orders",
        assigneeId: users[2].id,
        assignerId: users[1].id,
        dueDate: new Date("2025-11-12"),
        priority: "medium",
        status: "pending",
      },
    }),
    prisma.task.create({
      data: {
        title: "Update Product Catalog",
        description: "Add new products and update pricing",
        assigneeId: users[3].id,
        assignerId: users[0].id,
        dueDate: new Date("2025-11-10"),
        priority: "high",
        status: "in_progress",
        notes: "Include new electronics lineup",
      },
    }),
    prisma.task.create({
      data: {
        title: "Prepare Monthly Sales Report",
        description: "Compile October sales data and analysis",
        assigneeId: users[2].id,
        assignerId: users[1].id,
        dueDate: new Date("2025-11-08"),
        priority: "high",
        status: "completed",
        completedDate: new Date("2025-11-07"),
        notes: "Report submitted ahead of deadline",
      },
    }),
    prisma.task.create({
      data: {
        title: "Organize Warehouse Section B",
        description: "Reorganize electronics section for better accessibility",
        assigneeId: users[3].id,
        assignerId: users[1].id,
        dueDate: new Date("2025-11-20"),
        priority: "low",
        status: "pending",
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length} tasks`);

  const feedbacks = await Promise.all([
    prisma.customerFeedback.create({
      data: {
        customerId: customers[0].id,
        orderId: 1,
        rating: 5,
        comment:
          "Excellent service and timely delivery. Products were well packaged.",
        category: "delivery",
        status: "resolved",
        response: "Thank you for your valuable feedback!",
        respondedBy: users[4].id,
        respondedAt: new Date("2025-11-09"),
      },
    }),
    prisma.customerFeedback.create({
      data: {
        customerId: customers[1].id,
        orderId: 2,
        rating: 4,
        comment:
          "Good quality products. Delivery was slightly delayed but acceptable.",
        category: "delivery",
        status: "resolved",
        response:
          "We apologize for the delay and will improve our delivery times.",
        respondedBy: users[4].id,
        respondedAt: new Date("2025-11-08"),
      },
    }),
    prisma.customerFeedback.create({
      data: {
        customerId: customers[2].id,
        orderId: 4,
        rating: 5,
        comment: "Great prices and friendly staff!",
        category: "product",
        status: "new",
      },
    }),
    prisma.customerFeedback.create({
      data: {
        customerId: customers[4].id,
        orderId: 3,
        rating: 4,
        comment:
          "Products are good but would like more variety in electronics.",
        category: "product",
        status: "new",
      },
    }),
  ]);

  console.log(`✅ Created ${feedbacks.length} customer feedbacks`);

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Customers: ${customers.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Supplies: ${supplies.length}`);
  console.log(`   - Drivers: ${drivers.length}`);
  console.log(`   - Deliveries: ${deliveries.length}`);
  console.log(`   - Sales Orders: ${salesOrders.length}`);
  console.log(`   - Orders: ${orders.length}`);
  console.log(`   - Invoices: ${invoices.length}`);
  console.log(`   - Shipments: ${shipments.length}`);
  console.log(`   - Tasks: ${tasks.length}`);
  console.log(`   - Customer Feedbacks: ${feedbacks.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
