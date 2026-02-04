import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/orders
 * Get all base orders (optionally filter by type)
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { type } = req.query;

    const where = type ? { orderType: type } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        purchaseOrder: {
          include: {
            supplier: true,
          },
        },
        salesOrder: {
          include: {
            customer: true,
            driver: true,
          },
        },
        retailOrder: {
          include: {
            cart: true,
          },
        },
        invoices: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(orders);
  }),
);

/**
 * GET /api/orders/:id
 * Get a specific base order with its child
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        purchaseOrder: {
          include: {
            supplier: true,
            shipments: true,
            purchaseInvoices: true,
          },
        },
        salesOrder: {
          include: {
            customer: true,
            driver: true,
            delivery: true,
            salesInvoices: true,
            payments: true,
          },
        },
        retailOrder: {
          include: {
            cart: true,
          },
        },
        invoices: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  }),
);

/**
 * PUT /api/orders/:id
 * Update base order fields (status, notes, etc.)
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status, notes, totalAmount, items } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(totalAmount && { totalAmount }),
        ...(items && { items }),
      },
      include: {
        purchaseOrder: true,
        salesOrder: true,
        retailOrder: true,
      },
    });
    res.json(updatedOrder);
  }),
);

/**
 * GET /api/orders/summary
 * Get order summary by type and status
 */
router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const [totalOrders, purchaseOrders, salesOrders, retailOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { orderType: "purchase" } }),
        prisma.order.count({ where: { orderType: "sales" } }),
        prisma.order.count({ where: { orderType: "retail" } }),
      ]);

    const [pending, processing, completed, cancelled] = await Promise.all([
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "processing" } }),
      prisma.order.count({ where: { status: "completed" } }),
      prisma.order.count({ where: { status: "cancelled" } }),
    ]);

    res.json({
      total: totalOrders,
      byType: {
        purchase: purchaseOrders,
        sales: salesOrders,
        retail: retailOrders,
      },
      byStatus: {
        pending,
        processing,
        completed,
        cancelled,
      },
    });
  }),
);

export default router;
