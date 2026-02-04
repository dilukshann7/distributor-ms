import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/sales-orders
 * Get all sales orders with base order data
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const salesOrders = await prisma.salesOrder.findMany({
      include: {
        order: true,
        customer: true,
        driver: {
          include: {
            user: true,
          },
        },
        delivery: true,
        salesInvoices: {
          include: {
            invoice: true,
          },
        },
        payments: true,
      },
      orderBy: {
        order: {
          id: "desc",
        },
      },
    });
    res.json(salesOrders);
  }),
);

/**
 * GET /api/sales-orders/:id
 * Get a specific sales order
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id },
      include: {
        order: true,
        customer: true,
        driver: {
          include: {
            user: true,
          },
        },
        delivery: true,
        salesInvoices: {
          include: {
            invoice: true,
          },
        },
        payments: true,
      },
    });

    if (!salesOrder) {
      return res.status(404).json({ error: "Sales order not found" });
    }

    res.json(salesOrder);
  }),
);

/**
 * POST /api/sales-orders
 * Create a new sales order (creates both base Order and SalesOrder)
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      customerId,
      customerName,
      driverId,
      deliveryId,
      orderNumber,
      orderDate,
      totalAmount,
      items,
      notes,
      status,
      paymentStatus,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Generate order number if not provided
      const finalOrderNumber = orderNumber || `SO-${Date.now()}`;

      // Create the base Order first
      const baseOrder = await tx.order.create({
        data: {
          orderNumber: finalOrderNumber,
          orderType: "sales",
          orderDate: new Date(orderDate || new Date()),
          status: status || "pending",
          totalAmount,
          items,
          notes,
        },
      });

      // Create the SalesOrder child
      const salesOrder = await tx.salesOrder.create({
        data: {
          orderId: baseOrder.id,
          customerId,
          customerName,
          paymentStatus: paymentStatus || "unpaid",
          driverId,
          deliveryId,
        },
        include: {
          order: true,
          customer: true,
          driver: {
            include: {
              user: true,
            },
          },
        },
      });

      return salesOrder;
    });

    res.status(201).json(result);
  }),
);

/**
 * PUT /api/sales-orders/:id
 * Update a sales order
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const {
      customerId,
      customerName,
      driverId,
      deliveryId,
      orderDate,
      totalAmount,
      items,
      notes,
      status,
      paymentStatus,
    } = req.body;

    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!salesOrder) {
      return res.status(404).json({ error: "Sales order not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update base Order
      if (orderDate || totalAmount || items || notes || status) {
        await tx.order.update({
          where: { id: salesOrder.orderId },
          data: {
            ...(orderDate && { orderDate: new Date(orderDate) }),
            ...(totalAmount && { totalAmount }),
            ...(items && { items }),
            ...(notes !== undefined && { notes }),
            ...(status && { status }),
          },
        });
      }

      // Update SalesOrder child
      const updated = await tx.salesOrder.update({
        where: { id },
        data: {
          ...(customerId && { customerId }),
          ...(customerName && { customerName }),
          ...(driverId !== undefined && { driverId }),
          ...(deliveryId !== undefined && { deliveryId }),
          ...(paymentStatus && { paymentStatus }),
        },
        include: {
          order: true,
          customer: true,
          driver: {
            include: {
              user: true,
            },
          },
        },
      });

      return updated;
    });

    res.json(result);
  }),
);

/**
 * DELETE /api/sales-orders/:id
 * Delete a sales order (cascades to base Order)
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    const salesOrder = await prisma.salesOrder.findUnique({
      where: { id },
    });

    if (!salesOrder) {
      return res.status(404).json({ error: "Sales order not found" });
    }

    // Delete the base order (will cascade to salesOrder)
    await prisma.order.delete({
      where: { id: salesOrder.orderId },
    });

    res.status(204).send();
  }),
);

/**
 * POST /api/sales-orders/:id/assign-driver
 * Assign a driver to a sales order
 */
router.post(
  "/:id/assign-driver",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { driverId } = req.body;

    const updated = await prisma.salesOrder.update({
      where: { id },
      data: { driverId },
      include: {
        order: true,
        customer: true,
        driver: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(updated);
  }),
);

export default router;
