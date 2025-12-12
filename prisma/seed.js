const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.assistantManager.deleteMany();
  await prisma.distributor.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.cashier.deleteMany();
  await prisma.stockKeeper.deleteMany();
  await prisma.salesman.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating users...");

  // Create Owner
  const owner = await prisma.user.create({
    data: {
      name: "Owner",
      email: "owner@adpnamasinghe.lk",
      password: "123456789",
      role: "owner",
      phone: "+1234567809",
      address: "ADP Namasinghe Headquarters",
      status: "active",
      ownerProfile: {
        create: {},
      },
    },
  });
  console.log(`Created owner: ${owner.name}`);

  // Create Drivers
  const drivers = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Smith",
        email: "john.driver@example.com",
        password: "123456789",
        role: "driver",
        phone: "+1234567890",
        address: "123 Main St, City A",
        status: "active",
        driverProfile: {
          create: {
            vehicleId: "VEH001",
            vehicleType: "Van",
            licenseNumber: "DL123456",
            currentLocation: "Warehouse A",
            salary: 3500.0,
            bonus: 200.0,
            attendance: "excellent",
            performanceRating: 9,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Sarah Johnson",
        email: "sarah.driver@example.com",
        password: "123456789",
        role: "driver",
        phone: "+1234567891",
        address: "456 Oak Ave, City B",
        status: "active",
        driverProfile: {
          create: {
            vehicleId: "VEH002",
            vehicleType: "Truck",
            licenseNumber: "DL234567",
            currentLocation: "Route 5",
            salary: 3800.0,
            bonus: 300.0,
            attendance: "good",
            performanceRating: 8,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Mike Wilson",
        email: "mike.driver@example.com",
        password: "123456789",
        role: "driver",
        phone: "+1234567892",
        address: "789 Pine Rd, City C",
        status: "active",
        driverProfile: {
          create: {
            vehicleId: "VEH003",
            vehicleType: "Van",
            licenseNumber: "DL345678",
            currentLocation: "Depot B",
            salary: 3400.0,
            bonus: 150.0,
            attendance: "excellent",
            performanceRating: 9,
          },
        },
      },
    }),
  ]);
  console.log(`Created ${drivers.length} drivers`);

  // Create Managers
  const managers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Emily Brown",
        email: "emily.manager@example.com",
        password: "123456789",
        role: "manager",
        phone: "+1234567893",
        address: "321 Elm St, City A",
        status: "active",
        managerProfile: {
          create: {},
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "David Lee",
        email: "david.manager@example.com",
        password: "123456789",
        role: "manager",
        phone: "+1234567894",
        address: "654 Maple Dr, City B",
        status: "active",
        managerProfile: {
          create: {},
        },
      },
    }),
  ]);
  console.log(`Created ${managers.length} managers`);

  // Create Salesmen
  const salesmen = await Promise.all([
    prisma.user.create({
      data: {
        name: "Jessica Martinez",
        email: "jessica.sales@example.com",
        password: "123456789",
        role: "salesman",
        phone: "+1234567895",
        address: "987 Cedar Ln, City C",
        status: "active",
        salesmanProfile: {
          create: {
            salesTarget: 50000.0,
            totalSales: 45000.0,
            commission: 2250.0,
            salary: 4000.0,
            bonus: 500.0,
            attendance: "excellent",
            performanceRating: 9,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Robert Taylor",
        email: "robert.sales@example.com",
        password: "123456789",
        role: "salesman",
        phone: "+1234567896",
        address: "147 Birch Way, City A",
        status: "active",
        salesmanProfile: {
          create: {
            salesTarget: 45000.0,
            totalSales: 48000.0,
            commission: 2400.0,
            salary: 3800.0,
            bonus: 600.0,
            attendance: "excellent",
            performanceRating: 10,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Amanda White",
        email: "amanda.sales@example.com",
        password: "123456789",
        role: "salesman",
        phone: "+1234567897",
        address: "258 Spruce Ct, City B",
        status: "active",
        salesmanProfile: {
          create: {
            salesTarget: 40000.0,
            totalSales: 35000.0,
            commission: 1750.0,
            salary: 3500.0,
            bonus: 300.0,
            attendance: "good",
            performanceRating: 7,
          },
        },
      },
    }),
  ]);
  console.log(`Created ${salesmen.length} salesmen`);

  // Create Stock Keepers
  const stockKeepers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Christopher Davis",
        email: "chris.stock@example.com",
        password: "123456789",
        role: "stockkeeper",
        phone: "+1234567898",
        address: "369 Willow Pl, City C",
        status: "active",
        stockKeeperProfile: {
          create: {
            salary: 3200.0,
            bonus: 250.0,
            attendance: "excellent",
            performanceRating: 8,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Lisa Anderson",
        email: "lisa.stock@example.com",
        password: "123456789",
        role: "stockkeeper",
        phone: "+1234567899",
        address: "741 Ash Blvd, City A",
        status: "active",
        stockKeeperProfile: {
          create: {
            salary: 3100.0,
            bonus: 200.0,
            attendance: "good",
            performanceRating: 8,
          },
        },
      },
    }),
  ]);
  console.log(`Created ${stockKeepers.length} stock keepers`);

  // Create Cashiers
  const cashiers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Daniel Thomas",
        email: "daniel.cashier@example.com",
        password: "123456789",
        role: "cashier",
        phone: "+1234567800",
        address: "852 Poplar St, City B",
        status: "active",
        cashierProfile: {
          create: {
            salary: 2800.0,
            bonus: 150.0,
            attendance: "excellent",
            performanceRating: 9,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Michelle Garcia",
        email: "michelle.cashier@example.com",
        password: "123456789",
        role: "cashier",
        phone: "+1234567801",
        address: "963 Hickory Ave, City C",
        status: "active",
        cashierProfile: {
          create: {
            salary: 2900.0,
            bonus: 200.0,
            attendance: "good",
            performanceRating: 8,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Kevin Rodriguez",
        email: "kevin.cashier@example.com",
        password: "123456789",
        role: "cashier",
        phone: "+1234567802",
        address: "159 Walnut Rd, City A",
        status: "active",
        cashierProfile: {
          create: {
            salary: 2750.0,
            bonus: 100.0,
            attendance: "excellent",
            performanceRating: 9,
          },
        },
      },
    }),
  ]);
  console.log(`Created ${cashiers.length} cashiers`);

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Global Supplies Inc",
        email: "contact@globalsupplies.com",
        password: "123456789",
        role: "supplier",
        phone: "+1234567803",
        address: "753 Industrial Park, City B",
        status: "active",
        supplierProfile: {
          create: {
            companyName: "Global Supplies Inc",
            supplierType: "Wholesale",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Premium Products Ltd",
        email: "info@premiumproducts.com",
        password: "123456789",
        role: "supplier",
        phone: "+1234567804",
        address: "951 Commerce Way, City C",
        status: "active",
        supplierProfile: {
          create: {
            companyName: "Premium Products Ltd",
            supplierType: "Manufacturing",
          },
        },
      },
    }),
  ]);
  console.log(`Created ${suppliers.length} suppliers`);

  // Create Distributors
  const distributors = await Promise.all([
    prisma.user.create({
      data: {
        name: "James Miller",
        email: "james.dist@example.com",
        password: "123456789",
        role: "distributor",
        phone: "+1234567805",
        address: "357 Market St, City A",
        status: "active",
        distributorProfile: {
          create: {
            salary: 4200.0,
            bonus: 400.0,
            attendance: "excellent",
            performanceRating: 9,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Patricia Moore",
        email: "patricia.dist@example.com",
        password: "123456789",
        role: "distributor",
        phone: "+1234567806",
        address: "486 Trade Blvd, City B",
        status: "active",
        distributorProfile: {
          create: {
            salary: 4000.0,
            bonus: 350.0,
            attendance: "good",
            performanceRating: 8,
          },
        },
      },
    }),
  ]);
  console.log(`Created ${distributors.length} distributors`);

  // Create Assistant Managers
  const assistantManagers = await Promise.all([
    prisma.user.create({
      data: {
        name: "William Jackson",
        email: "william.assistant@example.com",
        password: "123456789",
        role: "assistant_manager",
        phone: "+1234567807",
        address: "642 Executive Dr, City C",
        status: "active",
        assistantManagerProfile: {
          create: {
            salary: 4500.0,
            bonus: 500.0,
            attendance: "excellent",
            performanceRating: 9,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: "Jennifer Martin",
        email: "jennifer.assistant@example.com",
        password: "123456789",
        role: "assistant_manager",
        phone: "+1234567808",
        address: "819 Management Ln, City A",
        status: "active",
        assistantManagerProfile: {
          create: {
            salary: 4300.0,
            bonus: 450.0,
            attendance: "excellent",
            performanceRating: 8,
          },
        },
      },
    }),
  ]);
  console.log(`Created ${assistantManagers.length} assistant managers`);

  console.log("\nSeeding completed successfully!");
  console.log(
    `Total users created: ${
      1 + // owner
      drivers.length +
      managers.length +
      salesmen.length +
      stockKeepers.length +
      cashiers.length +
      suppliers.length +
      distributors.length +
      assistantManagers.length
    }`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
