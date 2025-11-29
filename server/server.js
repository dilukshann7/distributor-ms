import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import cors from "cors";
const app = express();

const prisma = new PrismaClient();

app.use(express.static("dist"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    credentials: true,
  })
);
const PORT = process.env.PORT || 3000;

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get(
  "/api/users",
  asyncHandler(async (req, res) => {
    const posts = await prisma.user.findMany();
    res.json(posts);
  })
);

app.get(
  "/api/products",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  })
);

app.get(
  "/api/tasks",
  asyncHandler(async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  })
);

app.get(
  "/api/customer-feedbacks",
  asyncHandler(async (req, res) => {
    const feedbacks = await prisma.customerFeedback.findMany();
    res.json(feedbacks);
  })
);

app.get(
  "/api/orders",
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany();
    res.json(orders);
  })
);

app.put(
  "/api/orders/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const orderData = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: orderData,
    });
    res.json(updatedOrder);
  })
);

app.get(
  "/api/shipments",
  asyncHandler(async (req, res) => {
    const shipments = await prisma.shipment.findMany({
      include: { order: true },
    });
    res.json(shipments);
  })
);

app.get(
  "/api/invoices",
  asyncHandler(async (req, res) => {
    const invoices = await prisma.invoice.findMany({});
    res.json(invoices);
  })
);

app.get(
  "/api/supplies",
  asyncHandler(async (req, res) => {
    const { top } = req.query;
    const supplies = top
      ? await prisma.supply.findMany({
          orderBy: {
            stock: "desc",
          },
          take: parseInt(top, 10),
        })
      : await prisma.supply.findMany();
    res.json(supplies);
  })
);

app.get(
  "/api/orders/daily",
  asyncHandler(async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => {
      const items = o.items;
      return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
    }, 0);

    res.json({
      daily: { orders: totalOrders, revenue: totalRevenue, items: totalItems },
    });
  })
);

app.get(
  "/api/orders/weekly",
  asyncHandler(async (req, res) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: firstDayOfWeek,
          lt: lastDayOfWeek,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => {
      const items = o.items; // already JS array
      return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
    }, 0);

    res.json({
      weekly: { orders: totalOrders, revenue: totalRevenue, items: totalItems },
    });
  })
);

app.get(
  "/api/orders/monthly",
  asyncHandler(async (req, res) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // start of month
    const firstDayOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: firstDayOfMonth,
          lt: firstDayOfNextMonth,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => {
      const items = o.items;
      return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
    }, 0);

    res.json({
      monthly: {
        orders: totalOrders,
        revenue: totalRevenue,
        items: totalItems,
      },
    });
  })
);

app.get(
  "/api/orders/summary",
  asyncHandler(async (req, res) => {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({
      where: { status: "pending" },
    });
    const shippedOrders = await prisma.order.count({
      where: { status: "shipped" },
    });
    const completedOrders = await prisma.order.count({
      where: { status: "completed" },
    });

    res.json({
      total: totalOrders,
      pending: pendingOrders,
      shipped: shippedOrders,
      completed: completedOrders,
    });
  })
);

app.get(
  "/api/shipments/summary",
  asyncHandler(async (req, res) => {
    const totalShipments = await prisma.shipment.count();
    const pendingShipments = await prisma.shipment.count({
      where: { status: "pending" },
    });
    const inTransitShipments = await prisma.shipment.count({
      where: { status: "in_transit" },
    });
    const deliveredShipments = await prisma.shipment.count({
      where: { status: "delivered" },
    });
    res.json({
      total: totalShipments,
      pending: pendingShipments,
      inTransit: inTransitShipments,
      delivered: deliveredShipments,
    });
  })
);

app.get(
  "/api/sales-orders",
  asyncHandler(async (req, res) => {
    const salesOrders = await prisma.salesOrder.findMany();
    res.json(salesOrders);
  })
);

app.get(
  "/api/drivers",
  asyncHandler(async (req, res) => {
    const drivers = await prisma.driver.findMany({
      include: {
        deliveries: {
          include: {
            salesOrders: true,
          },
        },
      },
    });

    res.json(drivers);
  })
);

app.get(
  "/api/drivers/:id",
  asyncHandler(async (req, res) => {
    const driverId = parseInt(req.params.id, 10);

    if (isNaN(driverId)) {
      return res.status(400).json({ error: "Invalid driver ID" });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        deliveries: {
          include: {
            salesOrders: true,
          },
        },
      },
    });

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(driver);
  })
);

app.get(
  "/api/deliveries",
  asyncHandler(async (req, res) => {
    const deliveries = await prisma.delivery.findMany({
      include: {
        driver: true,
        salesOrders: true,
      },
      orderBy: {
        scheduledDate: "desc",
      },
    });

    res.json(deliveries);
  })
);

app.get(
  "/api/customers",
  asyncHandler(async (req, res) => {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  })
);

app.get(
  "/api/sales-invoices",
  asyncHandler(async (req, res) => {
    const salesInvoices = await prisma.salesInvoice.findMany({
      include: {
        salesOrder: true, // include linked SalesOrder
        delivery: true, // include linked Delivery
      },
    });

    res.json(salesInvoices);
  })
);

app.get(
  "/api/sales-invoices/driver/:driverId",
  asyncHandler(async (req, res) => {
    const driverId = parseInt(req.params.driverId);

    const salesInvoices = await prisma.salesInvoice.findMany({
      where: {
        delivery: {
          driverId: driverId, // filter invoices where the linked delivery has this driver
        },
      },
      include: {
        salesOrder: true, // include linked sales order
        delivery: true, // include linked delivery
      },
    });

    res.json(salesInvoices);
  })
);

app.get(
  "/api/carts",
  asyncHandler(async (req, res) => {
    const carts = await prisma.cart.findMany();
    res.json(carts);
  })
);

app.get(
  "/api/small-orders",
  asyncHandler(async (req, res) => {
    const smallOrders = await prisma.smallOrder.findMany({
      include: {
        cart: true,
      },
    });
    res.json(smallOrders);
  })
);

app.get(
  "/api/financial-overview",
  asyncHandler(async (req, res) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    for (let month = 1; month < 13; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 1);
      const salesOrders = await prisma.salesOrder.findMany({
        where: {
          orderDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      const orders = await prisma.order.findMany({
        where: {
          orderDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      const income = salesOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const expenses = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const profit = income - expenses;
      monthlyData.push({ month, income, expenses, profit });
    }
    res.json(monthlyData);
  })
);

app.post(
  "/api/supplies",
  asyncHandler(async (req, res) => {
    const supplyData = req.body;
    const newSupply = await prisma.supply.create({
      data: supplyData,
    });
    res.status(201).json(newSupply);
  })
);

app.put(
  "/api/supplies/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const supplyData = req.body;
    const updatedSupply = await prisma.supply.update({
      where: { id },
      data: supplyData,
    });
    res.json(updatedSupply);
  })
);

app.post(
  "/api/invoices",
  asyncHandler(async (req, res) => {
    const invoiceData = req.body;
    const newInvoice = await prisma.invoice.create({
      data: invoiceData,
    });
    res.status(201).json(newInvoice);
  })
);

app.post(
  "/api/sales-orders",
  asyncHandler(async (req, res) => {
    const orderData = req.body;
    const newOrder = await prisma.salesOrder.create({
      data: orderData,
    });
    res.status(201).json(newOrder);
  })
);

app.put(
  "/api/sales-orders/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const orderData = req.body;
    const updatedOrder = await prisma.salesOrder.update({
      where: { id },
      data: orderData,
    });
    res.json(updatedOrder);
  })
);

app.delete(
  "/api/sales-orders/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.salesOrder.delete({ where: { id } });
    res.status(204).send();
  })
);

app.delete(
  "/api/customers/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.customer.delete({ where: { id } });
    res.status(204).send();
  })
);

app.post(
  "/api/customers",
  asyncHandler(async (req, res) => {
    const customerData = req.body;
    const newCustomer = await prisma.customer.create({
      data: customerData,
    });
    res.status(201).json(newCustomer);
  })
);

app.post(
  "/api/shipments",
  asyncHandler(async (req, res) => {
    const shipmentData = req.body;
    const newShipment = await prisma.shipment.create({
      data: shipmentData,
    });
    res.status(201).json(newShipment);
  })
);

app.post(
  "/api/users",
  asyncHandler(async (req, res) => {
    const userData = req.body;
    const newUser = await prisma.user.create({
      data: userData,
    });
    res.status(201).json(newUser);
  })
);

app.put(
  "/api/users/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const userData = req.body;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });
    res.json(updatedUser);
  })
);

app.delete(
  "/api/users/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
