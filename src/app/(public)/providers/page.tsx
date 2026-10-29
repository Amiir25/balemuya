import { getAllServicesWithProviders } from "@/lib/db";
import Link from "next/link";
import React, { Suspense } from "react";
import ProviderCard from "./components/ProviderCard";

export default function ProvidersPage() {
  return (
    <main>
      <h1>All Providers</h1>
      <p className="mt-2 text-gray-600">
        Trusted service providers across Addis Ababa.
      </p>

      <Suspense fallback={<p>Loading Providers...</p>}>
        <ProviderList />
      </Suspense>
    </main>
  );
}

async function ProviderList() {
  const services = await getAllServicesWithProviders(4);
  console.log("SERVICES: ", services);

  return (
    <div className="mt-10 space-y-12">
      {services.map((s) => (
        <section
          key={s.id}
          className="border-t pt-8 first:border-t-0 first:pt-0"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              <span className="mr-2">{s.icon}</span>
              {s.name}
            </h2>
            <Link
              href={`/services/${s.slug}`}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
              See all ({s._count.providers}) →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {s.providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
