// components/Navbar.jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-gray-800 shadow-md flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          <span className="text-2xl font-bold text-green-600">Breathe Sa🌿e</span>
        </Link>
      </div>

      {/* Middle: Nav Links */}
      <div className="hidden md:flex space-x-10 font-bold">
        <Link href="/">
          <span className="text-white hover:text-blue-600 transition ">Home</span>
        </Link>
        <Link href="/about">
          <span className="text-white hover:text-blue-600 transition">About</span>
        </Link>
        {/* <Link href="/check-aqi">
          <span className="text-gray-700 hover:text-blue-600 transition">Check AQI</span>
        </Link> */}
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex space-x-4">
        <Link href="/login">
          <span className="px-4 py-2 border bg-white border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition cursor-pointer">
            Login
          </span>
        </Link>
        <Link href="/register">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Register
          </span>
        </Link>
      </div>
    </nav>
  );
}
