import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/purchase-orders
 * Get all purchase orders with base order data
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        order: true,
        supplier: {
          include: {
            user: true,
          },
        },
        shipments: true,
        purchaseInvoices: {
          include: {
            invoice: true,
          },
        },
      },
      orderBy: {
        order: {
          id: "desc",
        },
      },
    });
    res.json(purchaseOrders);
  }),
);

/**
 * GET /api/purchase-orders/:id
 * Get a specific purchase order
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        order: true,
        supplier: {
          include: {
            user: true,
          },
        },
        shipments: true,
        purchaseInvoices: {
          include: {
            invoice: true,
          },
        },
      },
    });

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    res.json(purchaseOrder);
  }),
);

/**
 * POST /api/purchase-orders
 * Create a new purchase order (creates both base Order and PurchaseOrder)
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      supplierId,
      dueDate,
      orderNumber,
      orderDate,
      totalAmount,
      items,
      notes,
      status,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Create the base Order first
      const baseOrder = await tx.order.create({
        data: {
          orderNumber,
          orderType: "purchase",
          orderDate: new Date(orderDate),
          status: status || "pending",
          totalAmount,
          items,
          notes,
        },
      });

      // Create the PurchaseOrder child
      const purchaseOrder = await tx.purchaseOrder.create({
        data: {
          orderId: baseOrder.id,
          supplierId,
          dueDate: new Date(dueDate),
        },
        include: {
          order: true,
          supplier: true,
        },
      });

      return purchaseOrder;
    });

    res.status(201).json(result);
  }),
);

/**
 * PUT /api/purchase-orders/:id
 * Update a purchase order
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const {
      supplierId,
      dueDate,
      orderDate,
      totalAmount,
      items,
      notes,
      status,
    } = req.body;

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update base Order
      if (orderDate || totalAmount || items || notes || status) {
        await tx.order.update({
          where: { id: purchaseOrder.orderId },
          data: {
            ...(orderDate && { orderDate: new Date(orderDate) }),
            ...(totalAmount && { totalAmount }),
            ...(items && { items }),
            ...(notes !== undefined && { notes }),
            ...(status && { status }),
          },
        });
      }

      // Update PurchaseOrder child
      const updated = await tx.purchaseOrder.update({
        where: { id },
        data: {
          ...(supplierId && { supplierId }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
        },
        include: {
          order: true,
          supplier: true,
        },
      });

      return updated;
    });

    res.json(result);
  }),
);

/**
 * DELETE /api/purchase-orders/:id
 * Delete a purchase order (cascades to base Order)
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
    });

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    // Delete the base order (will cascade to purchaseOrder)
    await prisma.order.delete({
      where: { id: purchaseOrder.orderId },
    });

    res.status(204).send();
  }),
);

/**
 * GET /api/purchase-orders/summary
 * Get purchase order summary by status
 */
router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const totalOrders = await prisma.purchaseOrder.count();
    const pendingOrders = await prisma.purchaseOrder.count({
      where: { order: { status: "pending" } },
    });
    const completedOrders = await prisma.purchaseOrder.count({
      where: { order: { status: "completed" } },
    });

    res.json({
      total: totalOrders,
      pending: pendingOrders,
      completed: completedOrders,
    });
  }),
);

export default router;
