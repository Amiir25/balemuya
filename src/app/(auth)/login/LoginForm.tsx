"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(Login, undefined);

  return (
    <form action={action} className="space-y-4">
      <p
        role="alert"
        className={`min-h-5 text-sm text-red-600 transition-opacity duration-300 ${
          state?.error ? "opacity-100" : "opacity-0"
        }`}
      >
        {state?.error}
      </p>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state?.values?.email}
          autoComplete="email"
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-gray-600">
        New here?{" "}
        <Link href="/signup" className="underline">Create an account</Link>
      </p>
    </form>
  );
}