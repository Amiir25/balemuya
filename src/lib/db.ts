import "server-only";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

// Get Providers
export function getProviders(filters: { service?: string; address?: string }) {
  return prisma.provider.findMany({
    where: {
      status: "approved",
      ...(filters.address && { address: filters.address }),
      ...(filters.service && { service: { slug: filters.service } }),
    },
    include: { service: true },
  });
}

// Get Services
export function getServices() {
  return prisma.service.findMany({
    // orderBy: { name: "asc" },
    include: {
      _count: { select: { providers: { where: { status: "approved" } } } },
    },
  });
}

// Get all providers
export async function getAllServicesWithProviders(perService = 4) {
  "use cache";
  cacheLife("hours");
  cacheTag("services", "providers");

  const services = await prisma.service.findMany({
    include: {
      providers: {
        where: { status: "approved" },
        orderBy: { ratingAvg: "desc" },
        take: perService,
        include: { user: { select: { name: true } } },
      },
      _count: { select: { providers: { where: { status: "approved" } } } },
    },
  });

  // hide services that have no approved providers yet
  return services.filter((s) => s.providers.length > 0);
}

// Get service detail
export async function getServiceWithProviders(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("services", "providers");

  return prisma.service.findUnique({
    where: { slug },
    include: {
      providers: {
        where: { status: "approved" },
        orderBy: { ratingAvg: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });
}

// Get service by slug
export async function getServiceBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  return prisma.service.findUnique({
    where: { slug },
    select: {
      name: true,
      _count: { select: { providers: { where: { status: "approved" } } } },
    },
  });
}

// Get provider by Id
export async function getProviderById(pid: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("providers", `provider-${pid}`);

  const provider = await prisma.provider.findUnique({
    where: { id: pid },
    include: {
      user: { select: { name: true } },
      service: { select: { name: true, slug: true, icon: true } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  // Pending, suspended and missing providers all look the smae to the public
  if (!provider || provider.status !== "approved") return null;
  return provider;
}

// Get approved provider Ids
export async function getApprovedProvidersIds() {
  "use cache";
  cacheLife("hours");
  cacheTag("providers");

  return prisma.provider.findMany({
    where: { status: "approved" },
    select: { id: true },
  })
}

// =========== Auth Function =========== //

// Get Email by Id
export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// Create new user
export function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: "customer" | "provider";
  phone: string;
}) {
  return prisma.user.create({ data });
}

// Get user by Id
export function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, role: true },
  });
}

// Get provider by user Id
export function getProviderByUserId(userId: string) {
  return prisma.provider.findUnique({ where: { userId } });
}


// =========== BOOKING =========== //
// Get bookings by provider
export function getBookingsByProvider(providerId: string) {
  return prisma.booking.findMany({
    where: { providerId },
    orderBy: { createdAt: "desc" },
    include: { customer: { select: { name: true, phone: true } } },
  });
}

// Get bookings by customer
export function getBookingsByCustomer(customerId: string) {
  return prisma.booking.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        include: {
          user: { select: { name: true } },
          service: { select: { name: true } },
        },
      },
    },
  });
}

// Fresh check (not the cached one): is this provider bookable right now?
export function getBookableProvider(id: string) {
  return prisma.provider.findFirst({
    where: { id, status: "approved" },
    select: { id: true },
  });
}

// Create booking
export function createBooking(data: {
  customerId: string;
  providerId: string;
  scheduledDate: Date;
  scheduledTime: string;
  address: string;
  notes?: string;
}) {
  return prisma.booking.create({ data });
}

// Check service
export function serviceExists(id: string) {
  return prisma.service.findUnique({ where: { id }, select: { id: true } });
}

// Create provider account
export function createProviderAccount(data: {
  user: { name: string; email: string; phone: string; passwordHash: string };
  provider: {
    serviceId: string; headline: string; bio: string;
    priceFrom: number; priceUnit: string; address: string;
  };
}) {
  return prisma.user.create({
    data: {
      ...data.user,
      role: "provider",
      provider: {
        create: { ...data.provider, photoUrl: "/people/1.jpg", status: "pending" },
      },
    },
    select: { id: true },
  });
}

// Get booking by Id
export function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { provider: { select: { userId: true, status: true } } },
  });
}

// update booking status
export function updateBookingStatus(id: string, status: "accepted" | "declined") {
  return prisma.booking.update({ where: { id }, data: { status } });
}