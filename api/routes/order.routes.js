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


export default router;
