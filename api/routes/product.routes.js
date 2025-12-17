import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/products
 * Get all products
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
      include: { supplier: true },
    });
    res.json(products);
  })
);

/**
 * POST /api/products
 * Create a new product
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const productData = req.body;
    const newProduct = await prisma.product.create({
      data: productData,
    });
    res.status(201).json(newProduct);
  })
);

/**
 * PUT /api/products/:id
 * Update a product
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const productData = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    });
    res.json(updatedProduct);
  })
);

/**
 * DELETE /api/products/:id
 * Delete a product
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  })
);

export default router;
