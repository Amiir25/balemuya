import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Log in | Fixer" };

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 mb-6 text-gray-600">Log in to book and manage services.</p>
      
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}