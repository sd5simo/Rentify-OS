import { PrismaClient } from "@prisma/client";
import { addDays, subDays, subMonths } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AutoFlex Admin database...");

  // Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        cin: "AB123456",
        firstName: "Youssef",
        lastName: "Benali",
        email: "youssef.benali@email.ma",
        phone: "0661234567",
        address: "12 Rue Hassan II",
        city: "Casablanca",
        licenseNum: "MA-12345",
        licenseExp: addDays(new Date(), 365),
        isBlacklist: false,
      },
    }),
    prisma.client.create({
      data: {
        cin: "CD789012",
        firstName: "Fatima",
        lastName: "Zahra Idrissi",
        email: "fz.idrissi@email.ma",
        phone: "0662345678",
        address: "45 Avenue Mohammed V",
        city: "Rabat",
        licenseNum: "MA-67890",
        licenseExp: addDays(new Date(), 200),
        isBlacklist: false,
      },
    }),
    prisma.client.create({
      data: {
        cin: "EF345678",
        firstName: "Omar",
        lastName: "Tazi",
        email: "omar.tazi@email.ma",
        phone: "0663456789",
        city: "Marrakech",
        isBlacklist: true,
        blacklistReason: "Retour de véhicule endommagé sans signalement",
        blacklistedAt: subDays(new Date(), 30),
      },
    }),
    prisma.client.create({
      data: {
        cin: "GH901234",
        firstName: "Aicha",
        lastName: "Slaoui",
        phone: "0664567890",
        city: "Fès",
        isBlacklist: false,
      },
    }),
    prisma.client.create({
      data: {
        cin: "IJ567890",
        firstName: "Karim",
        lastName: "Hajji",
        email: "k.hajji@email.ma",
        phone: "0665678901",
        city: "Agadir",
        isBlacklist: false,
      },
    }),
  ]);

  // Vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plate: "34567-A-6",
        brand: "Dacia",
        model: "Logan",
        year: 2022,
        category: "ECONOMY",
        color: "Blanc",
        fuelType: "DIESEL",
        transmission: "MANUAL",
        seats: 5,
        dailyRate: 250,
        status: "AVAILABLE",
        mileage: 45000,
        lastOilChangeMileage: 40000,
        nextOilChangeMileage: 50000,
        technicalInspectionDate: addDays(new Date(), 120),
        insuranceExpiry: addDays(new Date(), 300),
        vignetteExpiry: addDays(new Date(), 180),
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: "78901-B-6",
        brand: "Volkswagen",
        model: "Polo",
        year: 2023,
        category: "COMFORT",
        color: "Gris",
        fuelType: "ESSENCE",
        transmission: "AUTOMATIC",
        seats: 5,
        dailyRate: 400,
        status: "RENTED",
        mileage: 22000,
        lastOilChangeMileage: 20000,
        nextOilChangeMileage: 30000,
        technicalInspectionDate: addDays(new Date(), 45),
        insuranceExpiry: addDays(new Date(), 200),
        vignetteExpiry: addDays(new Date(), 90),
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: "12345-C-6",
        brand: "Toyota",
        model: "RAV4",
        year: 2021,
        category: "SUV",
        color: "Noir",
        fuelType: "HYBRID",
        transmission: "AUTOMATIC",
        seats: 5,
        dailyRate: 700,
        status: "AVAILABLE",
        mileage: 68000,
        lastOilChangeMileage: 60000,
        nextOilChangeMileage: 70000,
        technicalInspectionDate: subDays(new Date(), 15),
        insuranceExpiry: addDays(new Date(), 90),
        vignetteExpiry: addDays(new Date(), 30),
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: "56789-D-6",
        brand: "Mercedes",
        model: "C-Class",
        year: 2023,
        category: "LUXURY",
        color: "Noir",
        fuelType: "DIESEL",
        transmission: "AUTOMATIC",
        seats: 5,
        dailyRate: 1200,
        status: "MAINTENANCE",
        mileage: 15000,
        lastOilChangeMileage: 15000,
        nextOilChangeMileage: 25000,
        technicalInspectionDate: addDays(new Date(), 300),
        insuranceExpiry: addDays(new Date(), 365),
        vignetteExpiry: addDays(new Date(), 365),
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: "90123-E-6",
        brand: "Renault",
        model: "Master",
        year: 2020,
        category: "VAN",
        color: "Blanc",
        fuelType: "DIESEL",
        transmission: "MANUAL",
        seats: 9,
        dailyRate: 550,
        status: "AVAILABLE",
        mileage: 120000,
        lastOilChangeMileage: 110000,
        nextOilChangeMileage: 120000,
        technicalInspectionDate: addDays(new Date(), 60),
        insuranceExpiry: addDays(new Date(), 150),
        vignetteExpiry: addDays(new Date(), 60),
      },
    }),
  ]);

  // Rentals
  const rental1 = await prisma.rental.create({
    data: {
      contractNum: "CTR-2024-001",
      clientId: clients[0].id,
      vehicleId: vehicles[1].id,
      startDate: subDays(new Date(), 3),
      endDate: addDays(new Date(), 4),
      dailyRate: 400,
      totalDays: 7,
      totalAmount: 2800,
      deposit: 2000,
      fuelLevelStart: "FULL",
      mileageStart: 22000,
      status: "ACTIVE",
    },
  });

  // Historical rentals for stats
  const historicalRentals = [];
  for (let month = 0; month < 12; month++) {
    const startDate = subMonths(new Date(), month);
    for (let i = 0; i < 8; i++) {
      historicalRentals.push(
        prisma.rental.create({
          data: {
            contractNum: `CTR-2024-${String(month * 10 + i + 10).padStart(3, "0")}`,
            clientId: clients[i % clients.length].id,
            vehicleId: vehicles[i % vehicles.length].id,
            startDate: subDays(startDate, i * 3),
            endDate: subDays(startDate, i * 3 - 5),
            returnDate: subDays(startDate, i * 3 - 5),
            dailyRate: [250, 400, 700, 1200, 550][i % 5],
            totalDays: 5,
            totalAmount: [250, 400, 700, 1200, 550][i % 5] * 5,
            deposit: 2000,
            depositReturned: true,
            fuelLevelStart: "FULL",
            fuelLevelEnd: "HALF",
            mileageStart: 10000 + i * 500,
            mileageEnd: 10000 + i * 500 + 300,
            status: "COMPLETED",
          },
        })
      );
    }
  }
  await Promise.all(historicalRentals);

  // Expenses
  await Promise.all([
    prisma.expense.create({
      data: {
        vehicleId: vehicles[0].id,
        category: "MAINTENANCE",
        description: "Vidange + filtres",
        amount: 350,
        date: subDays(new Date(), 20),
        vendor: "Garage Central Casablanca",
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[2].id,
        category: "REPAIR",
        description: "Réparation pare-chocs arrière",
        amount: 1800,
        date: subDays(new Date(), 10),
        vendor: "Carrosserie Moderne",
      },
    }),
    prisma.expense.create({
      data: {
        category: "INSURANCE",
        description: "Assurance flotte mensuelle",
        amount: 4500,
        date: subDays(new Date(), 5),
        vendor: "Wafa Assurance",
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[1].id,
        category: "CLEANING",
        description: "Nettoyage complet intérieur/extérieur",
        amount: 150,
        date: subDays(new Date(), 2),
      },
    }),
  ]);

  // Damage logs
  await Promise.all([
    prisma.damageLog.create({
      data: {
        vehicleId: vehicles[0].id,
        description: "Rayure porte avant droite",
        severity: "MINOR",
        zone: "RIGHT",
        repaired: false,
      },
    }),
    prisma.damageLog.create({
      data: {
        vehicleId: vehicles[2].id,
        description: "Pare-chocs arrière fissuré",
        severity: "MODERATE",
        zone: "REAR",
        repaired: true,
        repairCost: 1800,
        repairedAt: subDays(new Date(), 10),
      },
    }),
  ]);

  // Infractions
  await Promise.all([
    prisma.infraction.create({
      data: {
        clientId: clients[2].id,
        type: "DAMAGE",
        description: "Retour véhicule avec dommages non déclarés",
        amount: 3500,
        date: subDays(new Date(), 30),
        resolved: false,
      },
    }),
    prisma.infraction.create({
      data: {
        clientId: clients[0].id,
        type: "LATE_RETURN",
        description: "Retour avec 2 jours de retard",
        amount: 800,
        date: subDays(new Date(), 60),
        resolved: true,
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`   ${clients.length} clients`);
  console.log(`   ${vehicles.length} vehicles`);
  console.log("   ~100 rentals (historical + active)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
