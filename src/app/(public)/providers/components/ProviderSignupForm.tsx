"use client";

import { useActionState } from "react";
import { signupProvider } from "@/app/(auth)/actions";
import { PRICE_UNITS, ADDRESSES } from "@/lib/constants";
import FieldError from "@/components/FieldError";

type Service = { id: string; name: string };
const input = "mt-1 w-full rounded-lg border px-3 py-2 text-sm";

export default function ProviderSignupForm({ services }: { services: Service[] }) {
  const [state, action, pending] = useActionState(signupProvider, undefined);
  const v = state?.values;
  const e = state?.errors;

  return (
    <form action={action} className="space-y-3">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Full name</label>
        <input id="name" name="name" defaultValue={v?.name} autoComplete="name" className={input} />
        <FieldError message={e?.name} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" defaultValue={v?.email} autoComplete="email" className={input} />
          <FieldError message={e?.email} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
          <input id="phone" name="phone" type="tel" defaultValue={v?.phone} placeholder="0911223344" autoComplete="tel" className={input} />
          <FieldError message={e?.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" className={input} />
        <FieldError message={e?.password} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium">Service</label>
          <select id="serviceId" name="serviceId" defaultValue={v?.serviceId ?? ""} className={input}>
            <option value="" disabled>Choose…</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <FieldError message={e?.serviceId} />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium">Area</label>
          <select id="address" name="address" defaultValue={v?.address ?? ""} className={input}>
            <option value="" disabled>Choose…</option>
            {ADDRESSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <FieldError message={e?.address} />
        </div>
      </div>

      <div>
        <label htmlFor="headline" className="block text-sm font-medium">Headline</label>
        <input id="headline" name="headline" defaultValue={v?.headline} placeholder="Licensed plumber, 8 years in Bole" className={input} />
        <FieldError message={e?.headline} />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium">About you</label>
        <textarea id="bio" name="bio" rows={4} defaultValue={v?.bio} className={input} />
        <FieldError message={e?.bio} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="priceFrom" className="block text-sm font-medium">Starting price (ETB)</label>
          <input id="priceFrom" name="priceFrom" type="number" inputMode="numeric" defaultValue={v?.priceFrom} className={input} />
          <FieldError message={e?.priceFrom} />
        </div>
        <div>
          <label htmlFor="priceUnit" className="block text-sm font-medium">Per</label>
          <select id="priceUnit" name="priceUnit" defaultValue={v?.priceUnit ?? ""} className={input}>
            <option value="" disabled>Choose…</option>
            {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <FieldError message={e?.priceUnit} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[#0D9488] px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create provider account"}
      </button>
    </form>
  );
}