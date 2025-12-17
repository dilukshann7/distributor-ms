import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/users
 * Get all users with their profiles
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      include: {
        driverProfile: true,
        managerProfile: true,
        salesmanProfile: true,
        stockKeeperProfile: true,
        cashierProfile: true,
        supplierProfile: true,
        distributorProfile: true,
        assistantManagerProfile: true,
        ownerProfile: true,
      },
    });
    res.json(users);
  })
);

/**
 * POST /api/users
 * Create a new user with role-specific profile
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userData = req.body;
    const { role } = userData;

    const newUser = await prisma.$transaction(async (prisma) => {
      const {
        vehicleId,
        vehicleType,
        licenseNumber,
        salesTarget,
        companyName,
        supplierType,
        attendance,
        performanceRating,
        salary,
        bonus,
        ...userFields
      } = userData;
      const user = await prisma.user.create({
        data: userFields,
      });

      switch (role) {
        case "Driver":
          await prisma.driver.create({
            data: {
              userId: user.id,
              vehicleId: userData.vehicleId || null,
              vehicleType: userData.vehicleType || null,
              licenseNumber: userData.licenseNumber || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Manager":
          await prisma.manager.create({
            data: {
              userId: user.id,
            },
          });
          break;
        case "Salesman":
          await prisma.salesman.create({
            data: {
              userId: user.id,
              salesTarget: userData.salesTarget || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Stock Keeper":
          await prisma.stockKeeper.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Cashier":
          await prisma.cashier.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Supplier":
          await prisma.supplier.create({
            data: {
              userId: user.id,
              companyName: userData.companyName || null,
              supplierType: userData.supplierType || null,
            },
          });
          break;
        case "Distributor":
          await prisma.distributor.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Assistant Manager":
          await prisma.assistantManager.create({
            data: {
              userId: user.id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
      }
      return user;
    });

    res.status(201).json(newUser);
  })
);

/**
 * PUT /api/users/:id
 * Update a user and their role-specific profile
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const userData = req.body;
    const { role } = userData;

    const updatedUser = await prisma.$transaction(async (prisma) => {
      const {
        vehicleId,
        vehicleType,
        licenseNumber,
        salesTarget,
        companyName,
        supplierType,
        attendance,
        performanceRating,
        salary,
        bonus,
        ...userFields
      } = userData;
      const user = await prisma.user.update({
        where: { id },
        data: userFields,
      });

      switch (role) {
        case "Driver":
          await prisma.driver.upsert({
            where: { userId: id },
            update: {
              vehicleId: userData.vehicleId || null,
              vehicleType: userData.vehicleType || null,
              licenseNumber: userData.licenseNumber || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              vehicleId: userData.vehicleId || null,
              vehicleType: userData.vehicleType || null,
              licenseNumber: userData.licenseNumber || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Manager":
          await prisma.manager.upsert({
            where: { userId: id },
            update: {},
            create: {
              userId: id,
            },
          });
          break;
        case "Salesman":
          await prisma.salesman.upsert({
            where: { userId: id },
            update: {
              salesTarget: userData.salesTarget || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              salesTarget: userData.salesTarget || null,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Stock Keeper":
          await prisma.stockKeeper.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Cashier":
          await prisma.cashier.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Supplier":
          await prisma.supplier.upsert({
            where: { userId: id },
            update: {
              companyName: userData.companyName || null,
              supplierType: userData.supplierType || null,
            },
            create: {
              userId: id,
              companyName: userData.companyName || null,
              supplierType: userData.supplierType || null,
            },
          });
          break;
        case "Distributor":
          await prisma.distributor.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
        case "Assistant Manager":
          await prisma.assistantManager.upsert({
            where: { userId: id },
            update: {
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
            create: {
              userId: id,
              attendance: userData.attendance || null,
              performanceRating: userData.performanceRating || null,
              salary: userData.salary || null,
              bonus: userData.bonus || null,
            },
          });
          break;
      }

      return user;
    });

    res.json(updatedUser);
  })
);

/**
 * DELETE /api/users/:id
 * Delete a user
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  })
);

export default router;
