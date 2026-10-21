"use client";

import Link from "next/link";
import React, { useState } from "react";
import NavbarProfile from "./NavbarProfile";
import NavbarLogin from "./NavbarLogin";
import NavbarLinks from "./NavbarLinks";

export default function SmallScreenNav() {
  const [showNav, setShowNav] = useState(true);
  return (
    <div>
      <h2 className="text-xl font-semibold" onClick={() => setShowNav(true)}>☰</h2>

      <div
        className={`flex flex-col items-center gap-4 absolute -top-1 bg-white p-3
        ${showNav ? "-left-1" : "-left-200"} w-screen h-screen transition-all duration-300`}
      >
        {/* Close */}
        <h2 className="text-xl font-semibold w-full text-right" onClick={() => setShowNav(false)}>✖</h2>
        <NavbarLinks/>
      </div>
    </div>
  );
}
