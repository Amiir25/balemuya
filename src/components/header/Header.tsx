import { Suspense } from "react";
import Logo from "./Logo";
import SmallScreenNav from "./SmallScreenNav";
import NavbarProfile from "./NavbarProfile";
import NavbarLinks from "./NavbarLinks";
import NavbarAction from "./NavbarAction";

const actionFallback = (
  <div className="h-8 w-24 animate-pulse rounded bg-gray-100" />
);

export default function Header() {
  return (
    <header className="relative flex items-center justify-between">
      <Logo />

      <div>
        {/* Large screen: links, My bookings, profile */}
        <div className="hidden items-center gap-4 md:flex">
          <NavbarLinks>
            <Suspense fallback={actionFallback}>
              <NavbarAction />
            </Suspense>
          </NavbarLinks>
          <Suspense fallback={null}>
            <NavbarProfile />
          </Suspense>
        </div>

        {/* Small screen: profile and ☰; My bookings lives inside the menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Suspense fallback={null}>
            <NavbarProfile />
          </Suspense>
          <SmallScreenNav>
            <Suspense fallback={actionFallback}>
              <NavbarAction />
            </Suspense>
          </SmallScreenNav>
        </div>
      </div>
    </header>
  );
}
