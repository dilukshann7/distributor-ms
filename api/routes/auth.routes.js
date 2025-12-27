import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/login
 * Authenticate user and create session
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
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

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    let userId;

    switch (user.role.toLowerCase()) {
      case "driver":
        userId = user.driverProfile.id;
        break;
      case "supplier":
        userId = user.supplierProfile.id;
        break;
      case "manager":
        userId = user.managerProfile.id;
        break;
      case "salesman":
        userId = user.salesmanProfile.id;
        break;
      case "stock_keeper":
        userId = user.stockKeeperProfile.id;
        break;
      case "cashier":
        userId = user.cashierProfile.id;
        break;
      case "distributor":
        userId = user.distributorProfile.id;
        break;
      case "assistant_manager":
        userId = user.assistantManagerProfile.id;
        break;
      case "owner":
        userId = user.ownerProfile.id;
        break;
    }

    const mapRoleToPath = (role) => {
      switch (role.toLowerCase()) {
        case "driver":
          return "/driver";
        case "supplier":
          return "/supplier";
        case "manager":
          return "/manager";
        case "salesman":
          return "/salesman";
        case "stock_keeper":
          return "/stock-keeper";
        case "cashier":
          return "/cashier";
        case "distributor":
          return "/distributor";
        case "assistant_manager":
          return "/assistant-manager";
        case "owner":
          return "/owner";
        default:
          return "/";
      }
    };

    req.session.isAuth = true;
    req.session.userId = userId;
    req.session.userRole = user.role;
    req.session.userEmail = user.email;

    const basePath = mapRoleToPath(user.role);
    const redirectUrl = ["/driver", "/supplier"].includes(basePath)
      ? `${basePath}?id=${userId}`
      : basePath;

    return res.redirect(redirectUrl);
  })
);

/**
 * GET /api/check-auth
 * Check if user is authenticated
 */
router.get("/check-auth", (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.session.isAuth) {
    return res.json({
      isAuth: true,
      user: {
        id: req.session.userId,
        role: req.session.userRole.toLowerCase(),
        email: req.session.userEmail,
      },
    });
  }
  res.json({ isAuth: false });
});

/**
 * POST /api/logout
 * Destroy user session and logout
 */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

export default router;
