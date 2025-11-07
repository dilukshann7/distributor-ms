import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
const app = express();
import cors from "cors";

const prisma = new PrismaClient();

app.use(express.static("dist"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    credentials: true,
  })
);
const PORT = process.env.PORT || 3000;

app.get("/api/users", async (req, res) => {
  const posts = await prisma.user.findMany();
  res.json(posts);
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (e) {
    console.error("Error fetching products:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
