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

app.get("/api/users", async (req, res) => {
  try {
    const posts = await prisma.user.findMany();
    res.json(posts);
  } catch (e) {
    console.error("Error fetching users:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (e) {
    console.error("Error fetching tasks:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/customer-feedbacks", async (req, res) => {
  try {
    const feedbacks = await prisma.customerFeedback.findMany();
    res.json(feedbacks);
  } catch (e) {
    console.error("Error fetching customer feedbacks:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (e) {
    console.error("Error fetching orders:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/shipments", async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: { order: true },
    });
    res.json(shipments);
  } catch (e) {
    console.error("Error fetching shipments:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({});
    res.json(invoices);
  } catch (e) {
    console.error("Error fetching invoices:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/supplies", async (req, res) => {
  try {
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
  } catch (e) {
    console.error("Error fetching supplies:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/orders/daily", async (req, res) => {
  try {
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
  } catch (e) {
    console.error("Error fetching daily orders:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/orders/weekly", async (req, res) => {
  try {
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
  } catch (e) {
    console.error("Error fetching weekly orders:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/orders/monthly", async (req, res) => {
  try {
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
  } catch (e) {
    console.error("Error fetching monthly orders:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/orders/summary", async (req, res) => {
  try {
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
  } catch (e) {
    console.error("Error fetching order summary:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/shipments/summary", async (req, res) => {
  try {
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
  } catch (e) {
    console.error("Error fetching shipment summary:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/supplier/overall-summary", async (req, res) => {
  try {
    // Daily Summary
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
    const dailyOrders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    const dailySummary = {
      orders: dailyOrders.length,
      revenue: dailyOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      items: dailyOrders.reduce((sum, o) => {
        try {
          const items =
            typeof o.items === "string" ? JSON.parse(o.items) : o.items || [];
          return (
            sum +
            (Array.isArray(items)
              ? items.reduce((n, i) => n + (i.quantity || 0), 0)
              : 0)
          );
        } catch (err) {
          console.error("Error parsing order items for daily summary:", err);
          return sum;
        }
      }, 0),
    };

    // Weekly Summary
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);

    const weeklyOrders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: firstDayOfWeek,
          lt: lastDayOfWeek,
        },
      },
    });
    const weeklySummary = {
      orders: weeklyOrders.length,
      revenue: weeklyOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      items: weeklyOrders.reduce((sum, o) => {
        try {
          const items =
            typeof o.items === "string" ? JSON.parse(o.items) : o.items || [];
          return (
            sum +
            (Array.isArray(items)
              ? items.reduce((n, i) => n + (i.quantity || 0), 0)
              : 0)
          );
        } catch (err) {
          console.error("Error parsing order items for weekly summary:", err);
          return sum;
        }
      }, 0),
    };

    // Monthly Summary
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const monthlyOrders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: firstDayOfMonth,
          lt: lastDayOfMonth,
        },
      },
    });
    const monthlySummary = {
      orders: monthlyOrders.length,
      revenue: monthlyOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      items: monthlyOrders.reduce((sum, o) => {
        const items = o.items;
        return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
      }, 0),
    };
    res.json({
      daily: dailySummary,
      weekly: weeklySummary,
      monthly: monthlySummary,
    });
  } catch (e) {
    console.error("Error fetching overall summary:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/sales-orders", async (req, res) => {
  try {
    const salesOrders = await prisma.salesOrder.findMany();
    res.json(salesOrders);
  } catch (e) {
    console.error("Error fetching sales orders:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/salesman/overall-summary", async (req, res) => {
  try {
    // Daily Summary
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
    const dailySales = await prisma.salesOrder.findMany({
      where: {
        orderDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    const dailySummary = {
      orders: dailySales.length,
      revenue: dailySales.reduce((sum, o) => sum + o.totalAmount, 0),
      items: dailySales.reduce((sum, o) => {
        try {
          const items =
            typeof o.items === "string" ? JSON.parse(o.items) : o.items || [];
          return (
            sum +
            (Array.isArray(items)
              ? items.reduce((n, i) => n + (i.quantity || 0), 0)
              : 0)
          );
        } catch (err) {
          console.error(
            "Error parsing salesOrder items for daily summary:",
            err
          );
          return sum;
        }
      }, 0),
    };

    // Monthly Summary
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const monthlySales = await prisma.salesOrder.findMany({
      where: {
        orderDate: {
          gte: firstDayOfMonth,
          lt: lastDayOfMonth,
        },
      },
    });

    const monthlySummary = {
      orders: monthlySales.length,
      revenue: monthlySales.reduce((sum, o) => sum + o.totalAmount, 0),
      items: monthlySales.reduce((sum, o) => {
        try {
          const items =
            typeof o.items === "string" ? JSON.parse(o.items) : o.items || [];
          return (
            sum +
            (Array.isArray(items)
              ? items.reduce((n, i) => n + (i.quantity || 0), 0)
              : 0)
          );
        } catch (err) {
          console.error(
            "Error parsing salesOrder items for monthly summary:",
            err
          );
          return sum;
        }
      }, 0),
    };

    // Weekly Summary
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
    const weeklySales = await prisma.salesOrder.findMany({
      where: {
        orderDate: {
          gte: firstDayOfWeek,
          lt: lastDayOfWeek,
        },
      },
    });
    const weeklySummary = {
      orders: weeklySales.length,
      revenue: weeklySales.reduce((sum, o) => sum + o.totalAmount, 0),
      items: weeklySales.reduce((sum, o) => {
        try {
          const items =
            typeof o.items === "string" ? JSON.parse(o.items) : o.items || [];
          return (
            sum +
            (Array.isArray(items)
              ? items.reduce((n, i) => n + (i.quantity || 0), 0)
              : 0)
          );
        } catch (err) {
          console.error(
            "Error parsing salesOrder items for weekly summary:",
            err
          );
          return sum;
        }
      }, 0),
    };
    res.json({
      daily: dailySummary,
      weekly: weeklySummary,
      monthly: monthlySummary,
    });
  } catch (e) {
    console.error("Error fetching overall summary:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/drivers", async (req, res) => {
  try {
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
  } catch (e) {
    console.error("Error fetching drivers with deliveries:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/drivers/:id", async (req, res) => {
  const driverId = parseInt(req.params.id, 10);

  if (isNaN(driverId)) {
    return res.status(400).json({ error: "Invalid driver ID" });
  }

  try {
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
  } catch (e) {
    console.error("Error fetching driver with deliveries:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/deliveries", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (e) {
    console.error("Error fetching customers:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
