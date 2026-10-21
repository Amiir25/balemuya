import { prisma } from "@/lib/prisma";

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