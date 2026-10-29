"use client";

import { useState, useTransition } from "react";
import useSWR from "swr";
import { acceptBooking, ActionResult, declineBooking } from "../actions";
import { badge, formatDate } from "@/lib/booking-ui";
import { ApiError, fetcher } from "@/lib/fetcher";
import type { ProviderRequest } from "@/types/booking";

export default function ProviderRequests({ userId }: { userId: string }) {
  const { data, error, isLoading, mutate } = useSWR<ProviderRequest[], ApiError>(
    ["/api/provider/bookings", userId],
    ([url]: [string, string]) => fetcher<ProviderRequest[]>(url),
    { refreshInterval: 15_000, revalidateOnFocus: true }
  );
  const [pending, startTransition] = useTransition();
  const [actionError, setActionError] = useState("");

  function respond(id: string, fn: (id: string) => Promise<ActionResult>) {
    setActionError("");
    startTransition(async () => {
      const result = await fn(id);
      if (!result.ok) setActionError(result.error);
      await mutate(); // re-fetch so the new status shows right away
    });
  }

  if (isLoading) {
    return (
      <ul className="mt-6 space-y-3" aria-busy="true">
        {[0, 1, 2].map((i) => <li key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />)}
      </ul>
    );
  }

  if (error && !data) {
    return (
      <div role="alert" className="mt-6 rounded-xl border p-6 text-center">
        <p className="font-medium">We couldn't load your requests.</p>
        <button onClick={() => mutate()} className="mt-3 underline">Try again</button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-6 rounded-xl border p-10 text-center">
        <p className="font-medium">No requests yet.</p>
        <p className="mt-1 text-sm text-gray-500">New booking requests will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <p role="alert" className={`mt-4 min-h-5 text-sm text-red-600 ${actionError ? "" : "invisible"}`}>
        {actionError}
      </p>
      <ul className="space-y-3">
        {data.map((b) => (
          <li key={b.id} className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{b.customer.name}</p>
                {b.customer.phone && <p className="text-sm text-gray-500">{b.customer.phone}</p>}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${badge[b.status]}`}>
                {b.status}
              </span>
            </div>

            <p className="mt-3 text-sm">{formatDate(b.scheduledDate)} at {b.scheduledTime}</p>
            <p className="text-sm text-gray-600">{b.address}</p>
            {b.notes && <p className="mt-2 text-sm text-gray-500">“{b.notes}”</p>}

            {b.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  disabled={pending}
                  onClick={() => respond(b.id, acceptBooking)}
                  className="rounded-lg bg-[#0D9488] px-4 py-1.5 text-sm text-white disabled:opacity-60"
                >
                  Accept
                </button>
                <button
                  disabled={pending}
                  onClick={() => respond(b.id, declineBooking)}
                  className="rounded-lg border px-4 py-1.5 text-sm disabled:opacity-60"
                >
                  Decline
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}