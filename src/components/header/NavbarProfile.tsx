"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function NavbarProfile() {
  const [login, setLogin] = useState(false);
  return (
    <>
      {login && (
        <h2 className="bg-[#0D9488] w-6 h-6 rounded-full flex items-center justify-center text-white">
          A
        </h2>
      )}
    </>
  );
}
