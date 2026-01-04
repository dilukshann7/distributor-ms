import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

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
