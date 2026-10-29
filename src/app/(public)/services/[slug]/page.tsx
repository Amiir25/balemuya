import {
  getServiceBySlug,
  getServices,
  getServiceWithProviders,
} from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProviderCard from "../../providers/components/ProviderCard";
import { Suspense } from "react";

type Props = { params: Promise<{ slug: string }> };

// Pre-render all service page at build time
export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

// Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found | Balemuya" };

  return {
    title: `${service.name} in Addis Ababa | Balemuya`,
    description: `Browse ${service._count.providers} trusted ${service.name.toLowerCase()} in Addis Ababa. Compare ratings and prices, then book online.`,
  };
}

export default function ServicePage({ params }: Props) {
  return (
    <main>
      <h1>Service Detail</h1>
      <Suspense fallback={<p>Loading service detail...</p>}>
        <ServiceDetail params={params} />
      </Suspense>
    </main>
  );
}

export async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceWithProviders(slug);

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-gray-500">
        <Link href="/services" className="hover:underline">
          Services
        </Link>
        <span className="mx-2">/</span>
        <span>{service.name}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-bold">
        <span className="mr-2">{service.icon}</span>
        {service.name}
      </h1>
      <p className="mt-2 text-gray-600">
        {service.providers.length} approved{" "}
        {service.providers.length === 1 ? "provider" : "providers"} in Addis
        Ababa
      </p>

      {service.providers.length === 0 ? (
        <div className="mt-10 rounded-xl border p-10 text-center">
          <p className="font-medium">No providers here yet.</p>
          <Link
            href="/providers"
            className="mt-3 inline-block text-sm underline"
          >
            Browse other services
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {service.providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}
