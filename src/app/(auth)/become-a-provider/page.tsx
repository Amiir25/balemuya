import Link from "next/link";
import { getServices } from "@/lib/db";
import ProviderSignupForm from "@/app/(public)/providers/components/ProviderSignupForm";

export const metadata = { title: "Become a provider | Fixer" };

export default async function BecomeProviderPage() {
  const services = await getServices(); // cached, so no Suspense needed
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold">Become a provider</h1>
      <p className="mt-1 mb-6 text-gray-600">
        Create your account. An admin reviews every profile before it goes public.
      </p>
      <ProviderSignupForm services={services.map((s) => ({ id: s.id, name: s.name }))} />
      <p className="mt-6 text-center text-sm text-gray-600">
        Looking for services instead? <Link href="/signup" className="underline">Sign up as a customer</Link>
      </p>
    </main>
  );
}