import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Define all roles with their profile model names
  const roles = [
    {
      role: "Owner",
      email: "owner@gmail.com",
      password: "owner",
      name: "Owner",
    },
    {
      role: "Manager",
      email: "manager@gmail.com",
      password: "manager",
      name: "Manager",
    },
    {
      role: "Assistant Manager",
      email: "assistantmanager@gmail.com",
      password: "assistantmanager",
      name: "Assistant Manager",
    },
    {
      role: "Driver",
      email: "driver@gmail.com",
      password: "driver",
      name: "Driver",
    },
    {
      role: "Salesman",
      email: "salesman@gmail.com",
      password: "salesman",
      name: "Salesman",
    },
    {
      role: "Stock Keeper",
      email: "stockkeeper@gmail.com",
      password: "stockkeeper",
      name: "Stock Keeper",
    },
    {
      role: "Cashier",
      email: "cashier@gmail.com",
      password: "cashier",
      name: "Cashier",
    },
    {
      role: "Supplier",
      email: "supplier@gmail.com",
      password: "supplier",
      name: "Supplier",
    },
    {
      role: "Distributor",
      email: "distributor@gmail.com",
      password: "distributor",
      name: "Distributor",
    },
  ];

  for (const roleData of roles) {
    console.log(`Creating ${roleData.role}...`);

    // Create user
    const user = await prisma.user.upsert({
      where: { email: roleData.email },
      update: {},
      create: {
        name: roleData.name,
        email: roleData.email,
        password: roleData.password,
        role: roleData.role,
        phone: null,
        address: null,
        status: "Active",
      },
    });

    console.log(`Created user: ${user.email}`);

    // Create corresponding profile based on role
    switch (roleData.role) {
      case "Owner":
        await prisma.owner.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        });
        break;

      case "Manager":
        await prisma.manager.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        });
        break;

      case "Assistant Manager":
        await prisma.assistantManager.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            salary: 50000,
            bonus: 0,
            attendance: "present",
            performanceRating: 5,
          },
        });
        break;

      case "Driver":
        await prisma.driver.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            vehicleId: "VEH-001",
            vehicleType: "Truck",
            licenseNumber: "DL-" + user.id,
            currentLocation: "Warehouse",
            salary: 40000,
            bonus: 0,
            attendance: "present",
            performanceRating: 5,
          },
        });
        break;

      case "Salesman":
        await prisma.salesman.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            salesTarget: 100000,
            totalSales: 0,
            commission: 0,
            salary: 45000,
            bonus: 0,
            attendance: "present",
            performanceRating: 5,
          },
        });
        break;

      case "Stock Keeper":
        await prisma.stockKeeper.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            salary: 35000,
            bonus: 0,
            attendance: "present",
            performanceRating: 5,
          },
        });
        break;

      case "Cashier":
        await prisma.cashier.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            salary: 30000,
            bonus: 0,
            attendance: "present",
            performanceRating: 5,
          },
        });
        break;

      case "Supplier":
        await prisma.supplier.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            companyName: "Supplier Company Ltd.",
            supplierType: "Wholesale",
          },
        });
        break;

      case "Distributor":
        await prisma.distributor.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            salary: 45000,
            bonus: 0,
            attendance: "present",
            performanceRating: 5,
          },
        });
        break;
    }

    console.log(`Created ${roleData.role} profile for ${user.email}`);
  }

  console.log("Seeding finished.");
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
