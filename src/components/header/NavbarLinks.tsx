import Link from "next/link";
import NavbarLogin from "./NavbarLogin";

export default function NavbarLinks() {
  return (
    <nav className="flex flex-col md:flex-row items-center gap-4 mt-10 md:mt-0">
      <Link href="/services">Services</Link>
      <Link href="/providers">Providers</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <NavbarLogin />
    </nav>
  );
}
