import { getServices } from "@/lib/db";
import Link from "next/link";
import React, { Suspense } from "react";

export default async function ServicesPage() {
  return (
    <main>
      <h1>Services</h1>

      <Suspense fallback={<p>Loading Services...</p>}>
        <ServiceList/>
      </Suspense>
    </main>
  )
}

async function ServiceList() {
  const services = await getServices();

  return (
    <>
      {services.length === 0 && <p>No service yet!</p>}
      <p>{services.length} Services</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => {
          const { name, slug, icon, description } = service;

          return (
            <Link
              key={name}
              href={`services/${slug}`}
              className="border p-4 rounded"
            >
              <h2>{name}</h2>
              <small>{icon}</small>
              {service._count.providers} Providers
              <p>{description}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
