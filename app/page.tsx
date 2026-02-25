import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { FaStore } from "react-icons/fa";

export default async function Home() {
  await connectDB();

  const products = await Product.find({ isDelete: false })
  .sort({ createdAt: -1 })
  .lean();

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-5xl mx-auto text-center px-4">
          <FaStore className="mx-auto text-5xl mb-6" />

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to My Store
          </h1>

          <p className="text-lg opacity-90 mb-8">
            Discover amazing products at unbeatable prices 🚀
          </p>

          <a
            href="#products"
            className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section id="products" className="bg-gray-50 py-20 flex-1">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
            Our Products
          </h2>

          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Browse our carefully selected products designed to deliver quality and value.
          </p>

          {products.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No products available.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {products.map((product: any) => (
                <div
                  key={product._id.toString()}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Product Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    <p className="text-2xl font-bold text-blue-600">
                      ₹{product.price}
                    </p>

                    <Link href={`/products/${product._id}`}>
                      <button className="mt-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-gray-700">
            <div className="p-8 rounded-xl shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">🚚 Fast Delivery</h3>
              <p>Quick and reliable shipping across India.</p>
            </div>

            <div className="p-8 rounded-xl shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">💳 Secure Payments</h3>
              <p>Safe and secure checkout experience.</p>
            </div>

            <div className="p-8 rounded-xl shadow-sm bg-gray-50">
              <h3 className="text-xl font-semibold mb-3">⭐ Quality Products</h3>
              <p>Carefully selected premium products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>© {new Date().getFullYear()} My Store. All rights reserved.</p>
      </footer>

    </div>
  );
}