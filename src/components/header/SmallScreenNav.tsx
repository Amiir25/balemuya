"use client";

import React, { ReactNode, useState } from "react";
import NavbarLinks from "./NavbarLinks";

export default function SmallScreenNav({ children }: { children: ReactNode }) {
  const [showNav, setShowNav] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-label="Open menu"
        className="text-xl font-semibold"
        onClick={() => setShowNav(true)}
      >
        ☰
      </button>

      <div
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setShowNav(false);
        }}
        className={`flex flex-col items-center gap-4 absolute -top-1 bg-white p-3 z-50
        ${showNav ? "-left-1" : "left-[-200vw]"} w-screen h-screen transition-all duration-300`}
      >
        <button
          type="button"
          aria-label="Close menu"
          className="text-xl font-semibold w-full text-right"
          onClick={() => setShowNav(false)}
        >
          ✖
        </button>
        <NavbarLinks>{children}</NavbarLinks>
      </div>
    </div>
  );
}
