import { getApprovedProvidersIds, getProviderById } from "@/lib/db";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ pid: string }> };

// Pre-render provider pages
export async function generateStaticParams() {
  const providers = await getApprovedProvidersIds();
  return providers.map((p) => ({ pid: p.id }));
}

// Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pid } = await params;
  const p = await getProviderById(pid);
  if (!p) return { title: "Provider not found | Fixer" };

  return {
    title: `${p.user.name}, ${p.service.name} in ${p.address} | Fixer`,
    description: `${p.headline}. Rated ${p.ratingAvg.toFixed(1)} from ${p.reviewCount} reviews. From ${p.priceFrom} ETB ${p.priceUnit}.`,
    openGraph: { images: [p.photoUrl] },
  };
}

// Stars fro Rate
function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span aria-label={`${value} out of 5`} className="text-amber-500">
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default function ProviderPage({ params }: Props) {
  return (
    <main>
      <Suspense fallback={<p>Loading Provider data...</p>}>
        <ProviderDetail params={params} />
      </Suspense>
    </main>
  );
}

export async function ProviderDetail({ params }: Props) {
  const { pid } = await params;
  const p = await getProviderById(pid);

  if (!p) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="text-sm text-gray-500">
        <Link href="/services" className="hover:underline">
          Services
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/services/${p.service.slug}`} className="hover:underline">
          {p.service.name}
        </Link>
        <span className="mx-2">/</span>
        <span>{p.user.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {/* Left: profile + reviews */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gray-100">
              <Image
                src={p.photoUrl}
                alt={p.user.name}
                fill
                sizes="112px"
                priority
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{p.user.name}</h1>
              <p className="text-gray-600">{p.headline}</p>
              <p className="mt-1 text-sm">
                <Stars value={p.ratingAvg} />{" "}
                <span className="font-medium">{p.ratingAvg.toFixed(1)}</span>{" "}
                <span className="text-gray-500">({p.reviewCount} reviews)</span>
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <dt className="text-gray-500">Service</dt>
              <dd className="font-medium">
                {p.service.icon} {p.service.name}
              </dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-gray-500">Area</dt>
              <dd className="font-medium">{p.address}</dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-gray-500">Price</dt>
              <dd className="font-medium">
                from {p.priceFrom} ETB {p.priceUnit}
              </dd>
            </div>
          </dl>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-2 text-gray-700">{p.bio}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">
              Reviews ({p.reviews.length})
            </h2>
            {p.reviews.length === 0 ? (
              <p className="mt-3 text-gray-500">No reviews yet.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {p.reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{r.authorName}</span>
                      <Stars value={r.rating} />
                    </div>
                    <p className="mt-2 text-gray-700">{r.comment}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {r.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right: booking widget slot (built in the booking step) */}
        <aside className="md:col-span-1">
          <div className="sticky top-6 rounded-xl border p-5">
            <h2 className="font-semibold">Book {p.user.name.split(" ")[0]}</h2>
            <p className="mt-1 text-sm text-gray-500">
              from {p.priceFrom} ETB {p.priceUnit}
            </p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
              Booking form coming soon.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
