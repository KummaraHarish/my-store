import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-xl font-bold text-blue-600">
          MyStore
        </h1>

        <div className="flex gap-6">
          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-blue-600 transition duration-200"
          >
            Home
          </Link>

          <Link
            href="/admin"
            className="text-gray-700 font-medium hover:text-blue-600 transition duration-200"
          >
            Admin
          </Link>

          <Link
            href="/cart"
            className="text-gray-700 font-medium hover:text-blue-600 transition duration-200"
          >
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}