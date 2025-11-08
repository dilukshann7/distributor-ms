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
    const shipments = await prisma.shipment.findMany();
    res.json(shipments);
  } catch (e) {
    console.error("Error fetching shipments:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany();
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
      const items = JSON.parse(o.items);
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
      const items = JSON.parse(o.items);
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
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: firstDayOfMonth,
          lt: lastDayOfMonth,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => {
      const items = JSON.parse(o.items);
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
