import { PrismaClient } from "../src/generated/prisma/client.ts";
import "dotenv/config";

const prisma = new PrismaClient();

async function main(params) {
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedpassword123", // ideally, use bcrypt to hash this
      role: "manager",
      phone: "0711234567",
      address: "123 Main Street, Colombo",
      salary: 75000.0,
      bonus: 5000.0,
      attendance: 95,
      performanceRating: 4,
      status: "active",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "hashedpassword456",
      role: "employee",
      phone: "0729876543",
      address: "45 Flower Road, Kandy",
      salary: 55000.0,
      bonus: 3000.0,
      attendance: 88,
      performanceRating: 3,
      status: "active",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
