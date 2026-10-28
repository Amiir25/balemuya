import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";

export default async function NavbarAction() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login" className="rounded border border-[#0D9488] px-4 py-1">
        Login
      </Link>
    );
  }

  const href = user.role === "admin" ? "/admin" : "/dashboard";
  const label =
    user.role === "admin"
      ? "Admin"
      : user.role === "provider"
        ? "Dashboard"
        : "My bookings";

  return (
    <Link href={href} className="rounded bg-[#0D9488] px-4 py-1 text-white">
      {label}
    </Link>
  );
}
