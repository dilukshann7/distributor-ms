import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/tasks
 * Get all tasks
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: true,
        assigner: true,
      },
    });
    res.json(tasks);
  }),
);

/**
 * POST /api/tasks
 * Create a new task
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { notes, ...taskData } = req.body;
    const newTask = await prisma.task.create({
      data: taskData,
    });
    res.status(201).json(newTask);
  }),
);

/**
 * PUT /api/tasks/:id
 * Update a task
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { notes, ...taskData } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id },
      data: taskData,
    });
    res.json(updatedTask);
  }),
);

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  }),
);

export default router;
