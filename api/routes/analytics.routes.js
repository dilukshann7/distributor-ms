import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/orders/daily
 * Get daily order statistics (all order types)
 */
router.get(
  "/orders/daily",
  asyncHandler(async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
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
      const items = o.items || [];
      return sum + items.reduce((n, i) => n + (i.quantity || 0), 0);
    }, 0);

    // Breakdown by order type
    const salesOrders = orders.filter((o) => o.orderType === "sales");
    const purchaseOrders = orders.filter((o) => o.orderType === "purchase");
    const retailOrders = orders.filter((o) => o.orderType === "retail");

    res.json({
      daily: {
        orders: totalOrders,
        revenue: totalRevenue,
        items: totalItems,
        byType: {
          sales: salesOrders.length,
          purchase: purchaseOrders.length,
          retail: retailOrders.length,
        },
      },
    });
  }),
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
    const processingOrders = await prisma.order.count({
      where: { status: "processing" },
    });
    const completedOrders = await prisma.order.count({
      where: { status: "completed" },
    });

    // By order type
    const purchaseCount = await prisma.order.count({
      where: { orderType: "purchase" },
    });
    const salesCount = await prisma.order.count({
      where: { orderType: "sales" },
    });
    const retailCount = await prisma.order.count({
      where: { orderType: "retail" },
    });

    res.json({
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      completed: completedOrders,
      byType: {
        purchase: purchaseCount,
        sales: salesCount,
        retail: retailCount,
      },
    });
  }),
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
  }),
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

      // Get sales orders (income) - from base Order where type is "sales"
      const salesOrders = await prisma.order.findMany({
        where: {
          orderType: "sales",
          orderDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      // Get retail orders (income) - from base Order where type is "retail"
      const retailOrders = await prisma.order.findMany({
        where: {
          orderType: "retail",
          orderDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      // Get purchase orders (expenses) - from base Order where type is "purchase"
      const purchaseOrders = await prisma.order.findMany({
        where: {
          orderType: "purchase",
          orderDate: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      const salesIncome = salesOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );
      const retailIncome = retailOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );
      const income = salesIncome + retailIncome;

      const expenses = purchaseOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );

      const profit = income - expenses;

      monthlyData.push({
        month,
        income,
        expenses,
        profit,
        breakdown: {
          salesIncome,
          retailIncome,
        },
      });
    }
    res.json(monthlyData);
  }),
);

/**
 * GET /api/invoices/summary
 * Get invoice summary by type and status
 */
router.get(
  "/invoices/summary",
  asyncHandler(async (req, res) => {
    const [total, pending, paid, overdue] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: "pending" } }),
      prisma.invoice.count({ where: { status: "paid" } }),
      prisma.invoice.count({
        where: {
          status: "pending",
          dueDate: { lt: new Date() },
        },
      }),
    ]);

    const [purchaseInvoices, salesInvoices] = await Promise.all([
      prisma.invoice.count({ where: { invoiceType: "purchase" } }),
      prisma.invoice.count({ where: { invoiceType: "sales" } }),
    ]);

    res.json({
      total,
      pending,
      paid,
      overdue,
      byType: {
        purchase: purchaseInvoices,
        sales: salesInvoices,
      },
    });
  }),
);

export default router;
