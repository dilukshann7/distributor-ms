import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/orders/daily
 * Get daily order statistics
 */
router.get(
  "/orders/daily",
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

/**
 * GET /api/orders/summary
 * Get order summary by status
 */
router.get(
  "/orders/summary",
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

/**
 * GET /api/shipments/summary
 * Get shipment summary by status
 */
router.get(
  "/shipments/summary",
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

/**
 * GET /api/financial-overview
 * Get monthly financial overview for the current year
 */
router.get(
  "/financial-overview",
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

export default router;
