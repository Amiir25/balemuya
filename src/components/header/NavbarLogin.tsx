"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function NavbarLogin() {
  const [login, setLogin] = useState(false);
  return (
    <>
      {!login && (
        <Link
          href={"/login"}
          className="border border-[#0D9488] px-4 py-1 rounded"
        >
          Login
        </Link>
      )}
    </>
  );
}
