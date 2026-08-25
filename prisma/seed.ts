// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const customer1 = await prisma.customer.upsert({
    where: {
      id: "customer-001",
    },
    update: {},
    create: {
      id: "customer-001",
      name: "John Doe",
      mobileNumber: "+61234567890",
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: {
      id: "customer-002",
    },
    update: {},
    create: {
      id: "customer-002",
      name: "Jane Smith",
      mobileNumber: "+61412345678",
    },
  });

  const property1 = await prisma.property.upsert({
    where: {
      id: "property-001",
    },
    update: {},
    create: {
      id: "property-001",
      customerId: customer1.id,
      type: "House",
      addressLine1: "123 Main St",
      addressLine2: null,
      suburb: "Richmond",
      state: "VIC",
      postalCode: "3121",
    },
  });

  const property2 = await prisma.property.upsert({
    where: {
      id: "property-002",
    },
    update: {},
    create: {
      id: "property-002",
      customerId: customer2.id,
      type: "House",
      addressLine1: "456 High St",
      addressLine2: null,
      suburb: "Melbourne",
      state: "VIC",
      postalCode: "3000",
    },
  });

  await prisma.booking.upsert({
    where: {
      id: "booking-001",
    },
    update: {},
    create: {
      id: "booking-001",
      propertyId: property1.id,
      service: "HOUSE_CLEANING",
      preferredDate: "2026-08-25",
      preferredTime: "09:00",
      status: "PENDING",
      createdAt: new Date("2026-08-20T10:00:00Z"),
    },
  });

  await prisma.booking.upsert({
    where: {
      id: "booking-002",
    },
    update: {},
    create: {
      id: "booking-002",
      propertyId: property2.id,
      service: "DEEP_CLEANING",
      preferredDate: "2026-08-26",
      preferredTime: "14:00",
      status: "APPROVED",
      createdAt: new Date("2026-08-19T10:00:00Z"),
    },
  });

  console.log("Booking seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
