"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-800 px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">  
        <Link href="/" className="text-2xl font-bold text-green-600">
          Breathe Sa🌿e
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 font-semibold">
          <Link href="/" className="text-white hover:text-blue-400 transition">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-blue-400 transition">
            About
          </Link>

          {/* Auth Buttons */}
          <Link
            href="/login"
            className="bg-white text-blue-600 border border-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-3 px-4 font-semibold">
          <Link
            href="/"
            className="text-white hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/login"
            className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
