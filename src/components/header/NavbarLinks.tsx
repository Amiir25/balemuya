import Link from "next/link";
import { ReactNode } from "react";

export default function NavbarLinks({ children }: { children: ReactNode }) {
  return (
    <nav className="flex flex-col md:flex-row items-center gap-4 mt-10 md:mt-0">
      <Link href="/services">Services</Link>
      <Link href="/providers">Providers</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      {children}
    </nav>
  );
}
