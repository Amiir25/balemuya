import Logo from "./Logo";
import SmallScreenNav from "./SmallScreenNav";
import NavbarProfile from "./NavbarProfile";
import NavbarLinks from "./NavbarLinks";

export default function Header() {
  return (
    <header className="flex items-center justify-between relative">
      {/* Logo */}
      <Logo />

      {/* Navigations */}
      <div className="">

        {/* Large screen */}
        <div className="hidden md:flex items-center gap-4">
            <NavbarLinks/>
            <NavbarProfile />
        </div>

        {/* Small screen */}
        <div className="flex md:hidden items-center gap-2">
          <NavbarProfile />
          <SmallScreenNav />
        </div>
      </div>
    </header>
  );
}
