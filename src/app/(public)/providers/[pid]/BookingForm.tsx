"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FieldError from "@/components/FieldError";

type Errors = Partial<Record<"date" | "time" | "address" | "notes", string>>;

export default function BookingForm({ providerId }: { providerId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      providerId,
      date: String(data.get("date") ?? ""),
      time: String(data.get("time") ?? ""),
      address: String(data.get("address") ?? ""),
      notes: String(data.get("notes") ?? ""),
    };

    // Quick client-side check (the API repeats this, and is the real protection)
    const next: Errors = {};
    if (!payload.date) next.date = "Choose a date.";
    if (!payload.time) next.time = "Choose a time.";
    if (payload.address.trim().length < 5) next.address = "Enter your address.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const json = await res.json().catch(() => ({}));

      if (res.status === 201) {
        setDone(true);
        form.reset();
      } else if (res.status === 422) {
        setErrors(json.errors ?? {});
      } else {
        setFormError(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Network problem. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
        <p className="font-medium">Request sent ✔</p>
        <p className="mt-1">The provider will accept or decline soon.</p>
        <Link href="/dashboard" className="mt-2 inline-block underline">View my bookings</Link>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-2 block text-xs underline"
        >
          Book another time
        </button>
      </div>
    );
  }

  const input = "mt-1 w-full rounded-lg border px-3 py-2 text-sm";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <p
        role="alert"
        className={`min-h-5 text-sm text-red-600 transition-opacity duration-300 ${
          formError ? "opacity-100" : "opacity-0"
        }`}
      >
        {formError}
      </p>

      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <input id="date" name="date" type="date" className={input} />
        <FieldError message={errors.date} />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium">Time</label>
        <input id="time" name="time" type="time" className={input} />
        <FieldError message={errors.time} />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium">Your address</label>
        <input id="address" name="address" placeholder="Bole, near Edna Mall" className={input} />
        <FieldError message={errors.address} />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea id="notes" name="notes" rows={3} className={input} />
        <FieldError message={errors.notes} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#0D9488] px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request booking"}
      </button>
    </form>
  );
}