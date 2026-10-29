"use client";

import { useActionState } from "react";
import { ADDRESSES, PRICE_UNITS } from "@/lib/constants";
import type { ProfileField } from "@/lib/validation";
import FieldError from "@/components/FieldError";
import { updateProfile } from "../actions";

type Props = {
  initial: Record<ProfileField, string>;
  services: { id: string; name: string }[];
};

const input = "mt-1 w-full rounded-lg border px-3 py-2 text-sm";

export default function ProfileEditForm({ initial, services }: Props) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const v = state?.values ?? initial; // last submitted values win over the saved ones
  const e = state?.errors;

  return (
    <form action={action} className="space-y-3">
      <p
        role="status"
        className={`min-h-5 text-sm transition-opacity duration-300 ${
          state?.saved ? "text-green-700 opacity-100" : state?.formError ? "text-red-600 opacity-100" : "opacity-0"
        }`}
      >
        {state?.saved ? "Profile saved ✔" : state?.formError}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium">Service</label>
          <select id="serviceId" name="serviceId" defaultValue={v.serviceId} className={input}>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <FieldError message={e?.serviceId} />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium">Area (sub-city)</label>
          <select id="address" name="address" defaultValue={v.address} className={input}>
            {ADDRESSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <FieldError message={e?.address} />
        </div>
      </div>

      <div>
        <label htmlFor="headline" className="block text-sm font-medium">Headline</label>
        <input id="headline" name="headline" defaultValue={v.headline} className={input} />
        <FieldError message={e?.headline} />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium">About you</label>
        <textarea id="bio" name="bio" rows={5} defaultValue={v.bio} className={input} />
        <FieldError message={e?.bio} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="priceFrom" className="block text-sm font-medium">Starting price (ETB)</label>
          <input id="priceFrom" name="priceFrom" type="number" inputMode="numeric" defaultValue={v.priceFrom} className={input} />
          <FieldError message={e?.priceFrom} />
        </div>
        <div>
          <label htmlFor="priceUnit" className="block text-sm font-medium">Per</label>
          <select id="priceUnit" name="priceUnit" defaultValue={v.priceUnit} className={input}>
            {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <FieldError message={e?.priceUnit} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#0D9488] px-5 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}