"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "../actions";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={state?.values?.name}
          autoComplete="name"
          className={`mt-1 w-full rounded-lg border px-3 py-2 ${state?.errors?.name && "border-red-300"} transition-all duration-900`}
        />
        <p
          className={`mt-1 min-h-4 text-xs text-red-600 transition-opacity duration-300 ${
            state?.errors?.name ? "opacity-100" : "opacity-0"
          }`}
        >
          {state?.errors?.name}
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state?.values?.email}
          autoComplete="email"
          className={`mt-1 w-full rounded-lg border px-3 py-2 ${state?.errors?.email && "border-red-300"} transition-all duration-900`}
        />
        <p
          className={`mt-1 min-h-4 text-xs text-red-600 transition-opacity duration-300 ${
            state?.errors?.email ? "opacity-100" : "opacity-0"
          }`}
        >
          {state?.errors?.email}
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className={`mt-1 w-full rounded-lg border px-3 py-2 ${state?.errors?.password && "border-red-300"} transition-all duration-900`}
        />
        <p
          className={`mt-1 min-h-4 text-xs text-red-600 transition-opacity duration-300 ${
            state?.errors?.password ? "opacity-100" : "opacity-0"
          }`}
        >
          {state?.errors?.password}
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={state?.values?.phone}
          autoComplete="tel"
          placeholder="0911223344"
          className={`mt-1 w-full rounded-lg border px-3 py-2 ${state?.errors?.phone && "border-red-300"} transition-all duration-900`}
        />
        <p
          className={`mt-1 min-h-4 text-xs text-red-600 transition-opacity duration-300 ${
            state?.errors?.phone ? "opacity-100" : "opacity-0"
          }`}
        >
          {state?.errors?.phone}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
