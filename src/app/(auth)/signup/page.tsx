import SignupForm from "./SignupForm";

export const metadata = { title: "Sign up | Balemuya" };

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 mb-6 text-gray-600">Find and book trusted providers in Addis.</p>
      <SignupForm />
    </main>
  );
}