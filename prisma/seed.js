const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clear existing data (order matters due to foreign keys)
  await prisma.smallOrder.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.salesInvoice.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customerFeedback.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supply.deleteMany();
  await prisma.task.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "John Admin",
        email: "john.admin@company.com",
        password: "$2b$10$hashedpassword1",
        role: "admin",
        phone: "+1234567890",
        address: "123 Admin St, City",
        salary: 75000,
        bonus: 5000,
        attendance: 95,
        performanceRating: 5,
        status: "active",
      },
      {
        name: "Sarah Manager",
        email: "sarah.manager@company.com",
        password: "$2b$10$hashedpassword2",
        role: "manager",
        phone: "+1234567891",
        address: "456 Manager Ave, City",
        salary: 65000,
        bonus: 4000,
        attendance: 92,
        performanceRating: 4,
        status: "active",
      },
      {
        name: "Mike Sales",
        email: "mike.sales@company.com",
        password: "$2b$10$hashedpassword3",
        role: "salesman",
        phone: "+1234567892",
        address: "789 Sales Rd, City",
        salary: 45000,
        bonus: 3000,
        attendance: 88,
        performanceRating: 4,
        status: "active",
      },
      {
        name: "Emma Warehouse",
        email: "emma.warehouse@company.com",
        password: "$2b$10$hashedpassword4",
        role: "warehouse",
        phone: "+1234567893",
        address: "321 Warehouse Ln, City",
        salary: 40000,
        bonus: 2000,
        attendance: 90,
        performanceRating: 4,
        status: "active",
      },
      {
        name: "David Support",
        email: "david.support@company.com",
        password: "$2b$10$hashedpassword5",
        role: "support",
        phone: "+1234567894",
        address: "654 Support Blvd, City",
        salary: 38000,
        bonus: 1500,
        attendance: 87,
        performanceRating: 3,
        status: "active",
      },
    ],
  });
  console.log(`Created ${users.count} users`);

  // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Laptop Pro 15",
        sku: "TECH-LP15-001",
        description: "High-performance laptop with 16GB RAM",
        category: "Electronics",
        price: 1299.99,
        quantity: 45,
        minStock: 10,
        maxStock: 100,
        location: "Warehouse A-1",
        supplierId: 1,
        batchNumber: "BATCH-2024-001",
        expiryDate: new Date("2027-12-31"),
        status: "active",
      },
      {
        name: "Wireless Mouse",
        sku: "TECH-WM-002",
        description: "Ergonomic wireless mouse",
        category: "Electronics",
        price: 29.99,
        quantity: 150,
        minStock: 30,
        maxStock: 200,
        location: "Warehouse A-2",
        supplierId: 1,
        batchNumber: "BATCH-2024-002",
        status: "active",
      },
      {
        name: "Office Chair Deluxe",
        sku: "FURN-OCD-003",
        description: "Comfortable office chair with lumbar support",
        category: "Furniture",
        price: 249.99,
        quantity: 30,
        minStock: 5,
        maxStock: 50,
        location: "Warehouse B-1",
        supplierId: 2,
        batchNumber: "BATCH-2024-003",
        status: "active",
      },
      {
        name: "USB-C Cable 2m",
        sku: "ACC-USBC-004",
        description: "Fast charging USB-C cable",
        category: "Accessories",
        price: 14.99,
        quantity: 200,
        minStock: 50,
        maxStock: 300,
        location: "Warehouse A-3",
        supplierId: 1,
        batchNumber: "BATCH-2024-004",
        status: "active",
      },
      {
        name: "Monitor 27 inch 4K",
        sku: "TECH-MON27-005",
        description: "4K UHD monitor with HDR",
        category: "Electronics",
        price: 449.99,
        quantity: 25,
        minStock: 5,
        maxStock: 40,
        location: "Warehouse A-1",
        supplierId: 1,
        batchNumber: "BATCH-2024-005",
        expiryDate: new Date("2028-06-30"),
        status: "active",
      },
      {
        name: "Desk Lamp LED",
        sku: "FURN-DL-006",
        description: "Adjustable LED desk lamp",
        category: "Furniture",
        price: 39.99,
        quantity: 80,
        minStock: 15,
        maxStock: 120,
        location: "Warehouse B-2",
        supplierId: 2,
        status: "active",
      },
    ],
  });
  console.log(`Created ${products.count} products`);

  // Create Customers
  const customers = await prisma.customer.createMany({
    data: [
      {
        name: "Acme Corporation",
        email: "contact@acmecorp.com",
        phone: "+1555000001",
        address: "100 Business Park, Tech City",
        businessName: "Acme Corporation",
        customerType: "business",
        isVIP: true,
        totalPurchases: 25,
        totalSpent: 45000.0,
        lastVisit: new Date("2025-11-15"),
        loyaltyPoints: 4500,
        status: "active",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1555000002",
        address: "456 Residential St, Suburb",
        customerType: "individual",
        isVIP: false,
        totalPurchases: 8,
        totalSpent: 3200.0,
        lastVisit: new Date("2025-11-10"),
        loyaltyPoints: 320,
        status: "active",
      },
      {
        name: "TechStart Inc",
        email: "orders@techstart.com",
        phone: "+1555000003",
        address: "789 Innovation Ave, StartupVille",
        businessName: "TechStart Inc",
        customerType: "business",
        isVIP: true,
        totalPurchases: 40,
        totalSpent: 78000.0,
        lastVisit: new Date("2025-11-17"),
        loyaltyPoints: 7800,
        status: "active",
      },
      {
        name: "Robert Johnson",
        email: "robert.j@email.com",
        phone: "+1555000004",
        address: "321 Main St, Downtown",
        customerType: "individual",
        isVIP: false,
        totalPurchases: 5,
        totalSpent: 1500.0,
        lastVisit: new Date("2025-11-05"),
        loyaltyPoints: 150,
        status: "active",
      },
      {
        name: "Global Solutions Ltd",
        email: "procurement@globalsolutions.com",
        phone: "+1555000005",
        address: "555 Corporate Plaza, Metro City",
        businessName: "Global Solutions Ltd",
        customerType: "business",
        isVIP: true,
        totalPurchases: 60,
        totalSpent: 120000.0,
        lastVisit: new Date("2025-11-16"),
        loyaltyPoints: 12000,
        status: "active",
      },
    ],
  });
  console.log(`Created ${customers.count} customers`);

  // Create Drivers
  const driver1 = await prisma.driver.create({
    data: {
      name: "Tom Driver",
      vehicleId: "VAN-001",
      vehicleType: "Delivery Van",
      licenseNumber: "DL123456",
      phone: "+1555100001",
      email: "tom.driver@company.com",
      currentLocation: "Warehouse",
      status: "active",
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: "Lisa Transport",
      vehicleId: "TRUCK-002",
      vehicleType: "Cargo Truck",
      licenseNumber: "DL789012",
      phone: "+1555100002",
      email: "lisa.transport@company.com",
      currentLocation: "Route 5",
      status: "active",
    },
  });

  const driver3 = await prisma.driver.create({
    data: {
      name: "Carlos Express",
      vehicleId: "VAN-003",
      vehicleType: "Express Van",
      licenseNumber: "DL345678",
      phone: "+1555100003",
      email: "carlos.express@company.com",
      currentLocation: "Downtown",
      status: "active",
    },
  });
  console.log("Created 3 drivers");

  // Create Deliveries
  const delivery1 = await prisma.delivery.create({
    data: {
      deliveryNumber: "DEL-2025-001",
      driverId: driver1.id,
      vehicleId: 1,
      deliveryAddress: "100 Business Park, Tech City",
      scheduledDate: new Date("2025-11-19"),
      deliveredDate: null,
      estimatedTime: 60,
      status: "in_transit",
      notes: "Customer prefers morning delivery",
    },
  });

  const delivery2 = await prisma.delivery.create({
    data: {
      deliveryNumber: "DEL-2025-002",
      driverId: driver2.id,
      vehicleId: 2,
      deliveryAddress: "789 Innovation Ave, StartupVille",
      scheduledDate: new Date("2025-11-18"),
      deliveredDate: new Date("2025-11-18T14:30:00"),
      estimatedTime: 90,
      status: "delivered",
      signature: "J.Doe",
      proofOfDelivery: "POD-2025-002.jpg",
      notes: "Delivered to reception",
    },
  });

  const delivery3 = await prisma.delivery.create({
    data: {
      deliveryNumber: "DEL-2025-003",
      driverId: driver3.id,
      vehicleId: 3,
      deliveryAddress: "456 Residential St, Suburb",
      scheduledDate: new Date("2025-11-20"),
      deliveredDate: null,
      estimatedTime: 45,
      status: "pending",
      notes: "Call before delivery",
    },
  });
  console.log("Created 3 deliveries");

  // Create Sales Orders
  const salesOrder1 = await prisma.salesOrder.create({
    data: {
      orderNumber: "SO-2025-001",
      customerId: 1,
      customerName: "Acme Corporation",
      salesmanId: 3,
      orderDate: new Date("2025-11-15"),
      subtotal: 5999.94,
      tax: 479.99,
      discount: 300.0,
      totalAmount: 6179.93,
      status: "confirmed",
      paymentStatus: "paid",
      deliveryId: delivery2.id,
      items: [
        { productId: 1, name: "Laptop Pro 15", quantity: 3, price: 1299.99 },
        {
          productId: 5,
          name: "Monitor 27 inch 4K",
          quantity: 5,
          price: 449.99,
        },
      ],
      notes: "Bulk order for new office setup",
    },
  });

  const salesOrder2 = await prisma.salesOrder.create({
    data: {
      orderNumber: "SO-2025-002",
      customerId: 2,
      customerName: "Jane Smith",
      salesmanId: 3,
      orderDate: new Date("2025-11-16"),
      subtotal: 324.97,
      tax: 26.0,
      discount: 0,
      totalAmount: 350.97,
      status: "processing",
      paymentStatus: "unpaid",
      deliveryId: delivery3.id,
      items: [
        {
          productId: 3,
          name: "Office Chair Deluxe",
          quantity: 1,
          price: 249.99,
        },
        { productId: 2, name: "Wireless Mouse", quantity: 1, price: 29.99 },
        { productId: 6, name: "Desk Lamp LED", quantity: 1, price: 39.99 },
      ],
      notes: "Home office setup",
    },
  });

  const salesOrder3 = await prisma.salesOrder.create({
    data: {
      orderNumber: "SO-2025-003",
      customerId: 3,
      customerName: "TechStart Inc",
      salesmanId: 3,
      orderDate: new Date("2025-11-17"),
      subtotal: 10499.85,
      tax: 839.99,
      discount: 500.0,
      totalAmount: 10839.84,
      status: "pending",
      paymentStatus: "partial",
      deliveryId: delivery1.id,
      items: [
        { productId: 1, name: "Laptop Pro 15", quantity: 5, price: 1299.99 },
        {
          productId: 5,
          name: "Monitor 27 inch 4K",
          quantity: 10,
          price: 449.99,
        },
      ],
      notes: "Startup expansion - priority delivery",
    },
  });
  console.log("Created 3 sales orders");

  // Create Sales Invoices
  await prisma.salesInvoice.createMany({
    data: [
      {
        invoiceNumber: "INV-S-2025-001",
        customerId: 1,
        salesOrderId: salesOrder1.id,
        deliveryId: delivery2.id,
        date: new Date("2025-11-18"),
        paymentMethod: "bank_transfer",
        items: [
          {
            productId: 1,
            name: "Laptop Pro 15",
            quantity: 3,
            price: 1299.99,
          },
          {
            productId: 5,
            name: "Monitor 27 inch 4K",
            quantity: 5,
            price: 449.99,
          },
        ],
        subtotal: 6179.93,
        collectedAmount: 6179.93,
        collectedAt: new Date("2025-11-18T15:00:00"),
        status: "paid",
      },
      {
        invoiceNumber: "INV-S-2025-002",
        customerId: 3,
        salesOrderId: salesOrder3.id,
        deliveryId: delivery1.id,
        date: new Date("2025-11-17"),
        paymentMethod: "credit_card",
        items: [
          {
            productId: 1,
            name: "Laptop Pro 15",
            quantity: 5,
            price: 1299.99,
          },
          {
            productId: 5,
            name: "Monitor 27 inch 4K",
            quantity: 10,
            price: 449.99,
          },
        ],
        subtotal: 10839.84,
        collectedAmount: 5000.0,
        collectedAt: new Date("2025-11-17T10:00:00"),
        status: "partial",
      },
      {
        invoiceNumber: "INV-S-2025-003",
        customerId: 2,
        salesOrderId: salesOrder2.id,
        deliveryId: delivery3.id,
        date: new Date("2025-11-16"),
        paymentMethod: "cash",
        items: [
          {
            productId: 3,
            name: "Office Chair Deluxe",
            quantity: 1,
            price: 249.99,
          },
        ],
        subtotal: 350.97,
        collectedAmount: 0,
        collectedAt: null,
        status: "pending",
      },
    ],
  });
  console.log("Created 3 sales invoices");

  // Create Purchase Orders
  const order1 = await prisma.order.create({
    data: {
      customerId: 1,
      orderDate: new Date("2025-11-10"),
      status: "completed",
      totalAmount: 15000.0,
      dueDate: new Date("2025-11-25"),
      itemIDs: [1, 2, 3],
      items: [
        { productId: 1, name: "Laptop Pro 15", quantity: 10, price: 1299.99 },
        { productId: 2, name: "Wireless Mouse", quantity: 20, price: 29.99 },
      ],
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: 2,
      orderDate: new Date("2025-11-12"),
      status: "processing",
      totalAmount: 8500.0,
      dueDate: new Date("2025-11-27"),
      itemIDs: [4, 5],
      items: [
        {
          productId: 5,
          name: "Monitor 27 inch 4K",
          quantity: 15,
          price: 449.99,
        },
        { productId: 4, name: "USB-C Cable 2m", quantity: 50, price: 14.99 },
      ],
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: 3,
      orderDate: new Date("2025-11-14"),
      status: "pending",
      totalAmount: 12000.0,
      dueDate: new Date("2025-12-01"),
      itemIDs: [3, 6],
      items: [
        {
          productId: 3,
          name: "Office Chair Deluxe",
          quantity: 30,
          price: 249.99,
        },
        { productId: 6, name: "Desk Lamp LED", quantity: 40, price: 39.99 },
      ],
    },
  });
  console.log("Created 3 purchase orders");

  // Create Supplies
  await prisma.supply.createMany({
    data: [
      {
        name: "Cardboard Boxes Large",
        sku: "PKG-BOX-L-001",
        category: "Packaging",
        stock: 500,
        price: 2.5,
        status: "available",
      },
      {
        name: "Bubble Wrap Roll",
        sku: "PKG-BW-002",
        category: "Packaging",
        stock: 100,
        price: 15.0,
        status: "available",
      },
      {
        name: "Packing Tape",
        sku: "PKG-TAPE-003",
        category: "Packaging",
        stock: 200,
        price: 3.99,
        status: "available",
      },
      {
        name: "Printer Paper A4",
        sku: "OFF-PAPER-004",
        category: "Office Supplies",
        stock: 150,
        price: 8.5,
        status: "available",
      },
      {
        name: "Cleaning Supplies Kit",
        sku: "CLN-KIT-005",
        category: "Maintenance",
        stock: 50,
        price: 25.0,
        status: "available",
      },
    ],
  });
  console.log("Created 5 supplies");

  // Create Invoices (Purchase)
  await prisma.invoice.createMany({
    data: [
      {
        invoiceNumber: "INV-P-2025-001",
        purchaseOrderId: order1.id,
        supplierId: 1,
        invoiceDate: new Date("2025-11-11"),
        dueDate: new Date("2025-11-26"),
        paidDate: new Date("2025-11-15"),
        totalAmount: 15000.0,
        paidAmount: 15000.0,
        balance: 0,
        status: "paid",
        notes: "Payment completed via wire transfer",
      },
      {
        invoiceNumber: "INV-P-2025-002",
        purchaseOrderId: order2.id,
        supplierId: 1,
        invoiceDate: new Date("2025-11-13"),
        dueDate: new Date("2025-11-28"),
        paidDate: null,
        totalAmount: 8500.0,
        paidAmount: 4000.0,
        balance: 4500.0,
        status: "partial",
        notes: "Partial payment received",
      },
      {
        invoiceNumber: "INV-P-2025-003",
        purchaseOrderId: order3.id,
        supplierId: 2,
        invoiceDate: new Date("2025-11-15"),
        dueDate: new Date("2025-12-02"),
        paidDate: null,
        totalAmount: 12000.0,
        paidAmount: 0,
        balance: 12000.0,
        status: "pending",
        notes: "Net 30 payment terms",
      },
    ],
  });
  console.log("Created 3 purchase invoices");

  // Create Shipments
  await prisma.shipment.createMany({
    data: [
      {
        shipmentNumber: "SHIP-2025-001",
        purchaseOrderId: order1.id,
        supplierId: 1,
        shipmentDate: new Date("2025-11-12"),
        expectedDeliveryDate: new Date("2025-11-18"),
        actualDeliveryDate: new Date("2025-11-17"),
        trackingNumber: "TRK123456789",
        carrier: "FedEx",
        status: "delivered",
        notes: "All items received in good condition",
      },
      {
        shipmentNumber: "SHIP-2025-002",
        purchaseOrderId: order2.id,
        supplierId: 1,
        shipmentDate: new Date("2025-11-14"),
        expectedDeliveryDate: new Date("2025-11-20"),
        actualDeliveryDate: new Date("2025-11-20"),
        trackingNumber: "TRK987654321",
        carrier: "UPS",
        status: "delivered",
        notes: "Signed by warehouse manager",
      },
      {
        shipmentNumber: "SHIP-2025-003",
        purchaseOrderId: order3.id,
        supplierId: 2,
        shipmentDate: new Date("2025-11-16"),
        expectedDeliveryDate: new Date("2025-11-22"),
        actualDeliveryDate: new Date("2025-11-22"),
        trackingNumber: "TRK456789123",
        carrier: "DHL",
        status: "in_transit",
        notes: "Expected arrival tomorrow",
      },
    ],
  });
  console.log("Created 3 shipments");

  // Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Process sales order SO-2025-003",
        description: "Verify inventory and prepare items for delivery",
        assigneeId: 4,
        assignerId: 2,
        dueDate: new Date("2025-11-19"),
        priority: "high",
        status: "in_progress",
        notes: "Customer is VIP - prioritize this order",
      },
      {
        title: "Follow up with late payment - INV-P-2025-002",
        description: "Contact supplier about outstanding balance",
        assigneeId: 2,
        assignerId: 1,
        dueDate: new Date("2025-11-20"),
        priority: "medium",
        status: "pending",
        notes: "Send reminder email first",
      },
      {
        title: "Inventory audit - Warehouse A",
        description:
          "Complete quarterly inventory count for electronics section",
        assigneeId: 4,
        assignerId: 2,
        dueDate: new Date("2025-11-25"),
        priority: "medium",
        status: "pending",
        notes: "Schedule during off-peak hours",
      },
      {
        title: "Update product catalog",
        description: "Add new product listings and update pricing",
        assigneeId: 3,
        assignerId: 2,
        dueDate: new Date("2025-11-21"),
        priority: "low",
        status: "pending",
        notes: "Coordinate with marketing team",
      },
      {
        title: "Resolve customer complaint - Ticket #456",
        description: "Customer reported damaged item in shipment SHIP-2025-001",
        assigneeId: 5,
        assignerId: 2,
        dueDate: new Date("2025-11-18"),
        priority: "high",
        status: "completed",
        completedDate: new Date("2025-11-18T16:00:00"),
        notes: "Replacement sent and customer satisfied",
      },
    ],
  });
  console.log("Created 5 tasks");

  // Create Customer Feedback
  await prisma.customerFeedback.createMany({
    data: [
      {
        customerId: 1,
        orderId: 1,
        rating: 5,
        comment: "Excellent service! Fast delivery and great product quality.",
        category: "delivery",
        status: "resolved",
        response:
          "Thank you for your positive feedback! We're glad you're satisfied.",
        respondedBy: 5,
        respondedAt: new Date("2025-11-16"),
      },
      {
        customerId: 2,
        orderId: 2,
        rating: 4,
        comment: "Good products but delivery was delayed by one day.",
        category: "delivery",
        status: "resolved",
        response:
          "We apologize for the delay. We've noted this for improvement.",
        respondedBy: 5,
        respondedAt: new Date("2025-11-17"),
      },
      {
        customerId: 3,
        orderId: 3,
        rating: 5,
        comment: "Outstanding customer service and product selection.",
        category: "service",
        status: "new",
        response: null,
        respondedBy: null,
        respondedAt: null,
      },
      {
        customerId: 4,
        orderId: 1,
        rating: 3,
        comment: "Product is okay but packaging could be better.",
        category: "product",
        status: "in_progress",
        response:
          "Thank you for your feedback. Our team is reviewing packaging procedures.",
        respondedBy: 5,
        respondedAt: new Date("2025-11-18"),
      },
      {
        customerId: 1,
        orderId: 2,
        rating: 5,
        comment: "Very impressed with the professionalism and quality.",
        category: "overall",
        status: "resolved",
        response: "We appreciate your business and kind words!",
        respondedBy: 5,
        respondedAt: new Date("2025-11-17"),
      },
    ],
  });
  console.log("Created 5 customer feedback entries");

  // Create Carts
  const cart1 = await prisma.cart.create({
    data: {
      items: [
        { productId: 2, name: "Wireless Mouse", quantity: 1, price: 29.99 },
        { productId: 4, name: "USB-C Cable 2m", quantity: 2, price: 14.99 },
      ],
      totalAmount: 59.97,
      status: "active",
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      items: [
        { productId: 6, name: "Desk Lamp LED", quantity: 3, price: 39.99 },
      ],
      totalAmount: 119.97,
      status: "active",
    },
  });

  const cart3 = await prisma.cart.create({
    data: {
      items: [
        { productId: 1, name: "Laptop Pro 15", quantity: 1, price: 1299.99 },
        {
          productId: 5,
          name: "Monitor 27 inch 4K",
          quantity: 1,
          price: 449.99,
        },
      ],
      totalAmount: 1749.98,
      status: "completed",
    },
  });
  console.log("Created 3 carts");

  // Create Small Orders
  await prisma.smallOrder.createMany({
    data: [
      {
        orderNumber: "SML-2025-001",
        cartId: cart1.id,
        status: "pending",
        paymentMethod: "credit_card",
      },
      {
        orderNumber: "SML-2025-002",
        cartId: cart2.id,
        status: "processing",
        paymentMethod: "paypal",
      },
      {
        orderNumber: "SML-2025-003",
        cartId: cart3.id,
        status: "completed",
        paymentMethod: "bank_transfer",
      },
    ],
  });
  console.log("Created 3 small orders");

  console.log("\n✅ Database seeding completed successfully!");
  console.log("\nSummary:");
  console.log("- Users: 5");
  console.log("- Products: 6");
  console.log("- Customers: 5");
  console.log("- Drivers: 3");
  console.log("- Deliveries: 3");
  console.log("- Sales Orders: 3");
  console.log("- Sales Invoices: 3");
  console.log("- Purchase Orders: 3");
  console.log("- Purchase Invoices: 3");
  console.log("- Shipments: 3");
  console.log("- Supplies: 5");
  console.log("- Tasks: 5");
  console.log("- Customer Feedback: 5");
  console.log("- Carts: 3");
  console.log("- Small Orders: 3");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
