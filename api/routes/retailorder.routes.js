import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/retail-orders
 * Get all retail orders with base order and cart data
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const retailOrders = await prisma.retailOrder.findMany({
      include: {
        order: true,
        cart: true,
      },
      orderBy: {
        order: {
          id: "desc",
        },
      },
    });
    res.json(retailOrders);
  }),
);

/**
 * GET /api/retail-orders/:id
 * Get a specific retail order
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const retailOrder = await prisma.retailOrder.findUnique({
      where: { id },
      include: {
        order: true,
        cart: true,
      },
    });

    if (!retailOrder) {
      return res.status(404).json({ error: "Retail order not found" });
    }

    res.json(retailOrder);
  }),
);

/**
 * POST /api/retail-orders
 * Create a new retail order from a cart
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { cartId, orderNumber } = req.body;

    // Get the cart
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Generate order number if not provided
      const finalOrderNumber = orderNumber || `RO-${Date.now()}`;

      // Create base Order
      const baseOrder = await tx.order.create({
        data: {
          orderNumber: finalOrderNumber,
          orderType: "retail",
          orderDate: new Date(),
          status: "completed", // Retail orders are typically completed immediately
          totalAmount: cart.totalAmount,
          items: cart.items,
        },
      });

      // Create RetailOrder child
      const retailOrder = await tx.retailOrder.create({
        data: {
          orderId: baseOrder.id,
          cartId: cart.id,
        },
        include: {
          order: true,
          cart: true,
        },
      });

      // Update cart status
      await tx.cart.update({
        where: { id: cartId },
        data: { status: "completed" },
      });

      return retailOrder;
    });

    res.status(201).json(result);
  }),
);

/**
 * PUT /api/retail-orders/:id
 * Update a retail order
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status, notes } = req.body;

    const retailOrder = await prisma.retailOrder.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!retailOrder) {
      return res.status(404).json({ error: "Retail order not found" });
    }

    // Update base Order
    await prisma.order.update({
      where: { id: retailOrder.orderId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    const updated = await prisma.retailOrder.findUnique({
      where: { id },
      include: {
        order: true,
        cart: true,
      },
    });

    res.json(updated);
  }),
);

/**
 * DELETE /api/retail-orders/:id
 * Delete a retail order
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    const retailOrder = await prisma.retailOrder.findUnique({
      where: { id },
    });

    if (!retailOrder) {
      return res.status(404).json({ error: "Retail order not found" });
    }

    // Delete the base order (cascades to retailOrder)
    await prisma.order.delete({
      where: { id: retailOrder.orderId },
    });

    res.status(204).send();
  }),
);

export default router;
