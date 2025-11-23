// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-purple-600">
          MyApp
        </Link>

        {/* Desktop Links */}
        <div className="hidden gap-6 md:flex">
          <Link href="/dashboard" className="hover:text-purple-600">
            Dashboard
          </Link>
          <Link href="/learn" className="hover:text-purple-600">
            Learn
          </Link>
          <Link href="/profile" className="hover:text-purple-600">
            Profile
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="block md:hidden" onClick={() => setOpen(!open)}>
          <span className="material-icons text-3xl">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          <Link href="/dashboard" className="hover:text-purple-600">
            Dashboard
          </Link>
          <Link href="/learn" className="hover:text-purple-600">
            Learn
          </Link>
          <Link href="/profile" className="hover:text-purple-600">
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
}
