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