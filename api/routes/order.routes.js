import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/orders
 * Get all orders
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany();
    res.json(orders);
  })
);

/**
 * POST /api/orders
 * Create a new order
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const orderData = req.body;
    const newOrder = await prisma.order.create({
      data: orderData,
    });
    res.status(201).json(newOrder);
  })
);

/**
 * PUT /api/orders/:id
 * Update an order
 */
router.put(
  "/:id",
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

/**
 * GET /api/sales-orders
 * Get all sales orders
 */
router.get(
  "/sales-orders",
  asyncHandler(async (req, res) => {
    const salesOrders = await prisma.salesOrder.findMany({
      include: {
        driver: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json(salesOrders);
  })
);

/**
 * POST /api/sales-orders
 * Create a new sales order
 */
router.post(
  "/sales-orders",
  asyncHandler(async (req, res) => {
    const orderData = req.body;
    const newOrder = await prisma.salesOrder.create({
      data: orderData,
    });
    res.status(201).json(newOrder);
  })
);

/**
 * PUT /api/sales-orders/:id
 * Update a sales order
 */
router.put(
  "/sales-orders/:id",
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

/**
 * DELETE /api/sales-orders/:id
 * Delete a sales order
 */
router.delete(
  "/sales-orders/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.salesOrder.delete({ where: { id } });
    res.status(204).send();
  })
);

/**
 * GET /api/small-orders
 * Get all small orders
 */
router.get(
  "/small-orders",
  asyncHandler(async (req, res) => {
    const smallOrders = await prisma.smallOrder.findMany({
      include: {
        cart: true,
      },
    });
    res.json(smallOrders);
  })
);

/**
 * POST /api/small-orders
 * Create a new small order
 */
router.post(
  "/small-orders",
  asyncHandler(async (req, res) => {
    const smallOrderData = req.body;
    const newSmallOrder = await prisma.smallOrder.create({
      data: smallOrderData,
    });
    res.status(201).json(newSmallOrder);
  })
);

/**
 * GET /api/carts
 * Get all carts
 */
router.get(
  "/carts",
  asyncHandler(async (req, res) => {
    const carts = await prisma.cart.findMany();
    res.json(carts);
  })
);

/**
 * POST /api/carts
 * Create a new cart
 */
router.post(
  "/carts",
  asyncHandler(async (req, res) => {
    const cartData = req.body;
    const newCart = await prisma.cart.create({
      data: cartData,
    });
    res.status(201).json(newCart);
  })
);

/**
 * PUT /api/carts/:id
 * Update a cart
 */
router.put(
  "/carts/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const cartData = req.body;
    const updatedCart = await prisma.cart.update({
      where: { id },
      data: cartData,
    });
    res.json(updatedCart);
  })
);

export default router;
