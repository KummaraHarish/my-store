"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/logout");
    window.location.href = "/admin/login";
  };

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-xl font-bold text-blue-600">
          MyStore
        </h1>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            href="/admin"
            className="text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Admin
          </Link>

          <Link
            href="/cart"
            className="text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Cart
          </Link>

          {/* ✅ Mobile Logout Button */}
          {isAdminPage && (
            <button
              onClick={handleLogout}
              className="md:hidden bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}