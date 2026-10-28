"use client";

import Link from "next/link";
import useSWR from "swr";
import { ApiError, fetcher } from "@/lib/fetcher";
import type { BookingStatus, MyBooking } from "@/types/booking";

const badge: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

// scheduledDate is stored as UTC midnight, so format it in UTC.
// Otherwise a user in another timezone could see the day before.
function formatDate(d: string) {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function MyBookings({ userId }: { userId: string }) {
  const { data, error, isLoading, mutate } = useSWR<MyBooking[], ApiError>(
    ["/api/bookings", userId],
    ([url]: [string, string]) => fetcher<MyBooking[]>(url),
    { refreshInterval: 15_000, revalidateOnFocus: true }
  );

  // 1. First load, nothing cached yet
  if (isLoading) {
    return (
      <ul className="mt-6 space-y-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </ul>
    );
  }

  // 2. Error and nothing to show
  if (error && !data) {
    return (
      <div role="alert" className="mt-6 rounded-xl border p-6 text-center">
        {error.status === 401 ? (
          <>
            <p className="font-medium">Your session has expired.</p>
            <Link href="/login?next=/dashboard" className="mt-3 inline-block underline">
              Log in again
            </Link>
          </>
        ) : (
          <>
            <p className="font-medium">We couldn't load your bookings.</p>
            <button onClick={() => mutate()} className="mt-3 underline">
              Try again
            </button>
          </>
        )}
      </div>
    );
  }

  // 3. Loaded, but empty
  if (!data || data.length === 0) {
    return (
      <div className="mt-6 rounded-xl border p-10 text-center">
        <p className="font-medium">No bookings yet.</p>
        <p className="mt-1 text-sm text-gray-500">Find a provider and request your first booking.</p>
        <Link
          href="/services"
          className="mt-4 inline-block rounded-lg bg-[#0D9488] px-4 py-2 text-sm text-white"
        >
          Browse services
        </Link>
      </div>
    );
  }

  // 4. The list
  return (
    <ul className="mt-6 space-y-3">
      {data.map((b) => (
        <li key={b.id} className="rounded-xl border p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link href={`/providers/${b.provider.id}`} className="font-semibold hover:underline">
                {b.provider.name}
              </Link>
              <p className="text-sm text-gray-500">{b.provider.service}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${badge[b.status]}`}
            >
              {b.status}
            </span>
          </div>

          <p className="mt-3 text-sm">
            {formatDate(b.scheduledDate)} at {b.scheduledTime}
          </p>
          <p className="text-sm text-gray-600">{b.address}</p>
          {b.notes && <p className="mt-2 text-sm text-gray-500">“{b.notes}”</p>}
        </li>
      ))}
    </ul>
  );
}