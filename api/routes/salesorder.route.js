import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/",
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
  "/",
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
  "/:id",
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
  "/:id",
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
  "/",
  asyncHandler(async (req, res) => {
    const smallOrders = await prisma.smallOrder.findMany({
      include: {
        cart: true,
      },
    });
    res.json(smallOrders);
  })
);



export default router;
