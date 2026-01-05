import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/small-orders
 * Create a new small order
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const smallOrderData = req.body;
    const newSmallOrder = await prisma.smallOrder.create({
      data: smallOrderData,
    });
    res.status(201).json(newSmallOrder);
  })
);

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
