import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaArrowLeft,
} from "react-icons/fa";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetails({ params }: Props) {
  await connectDB();

  const { id } = await params;

  const product = await Product.findOne({
    _id: id,
    isDelete: false,
  }).lean();

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-10"
        >
          <FaArrowLeft />
          Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-md p-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* IMAGE SECTION */}
            <div className="bg-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={700}
                height={700}
                className="rounded-xl object-cover w-full h-[500px] hover:scale-105 transition duration-300"
              />
            </div>

            {/* DETAILS SECTION */}
            <div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-3xl font-bold text-blue-600 mt-4">
                ₹{product.price}
              </p>

              {/* Stock */}
              <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                In Stock
              </span>

              {/* CONTACT SECTION */}
              <div className="mt-12 bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Seller Contact Information
                </h2>

                <div className="space-y-5 text-gray-700">

                  <div className="flex items-center gap-3">
                    <FaUser className="text-blue-600" />
                    <span className="font-medium">Harish Kummara</span>
                  </div>

                  <a
                    href="tel:+919381718677"
                    className="flex items-center gap-3 hover:text-green-600 transition"
                  >
                    <FaPhoneAlt className="text-green-600" />
                    <span>
                      <strong>Call:</strong> +91 9381718677
                    </span>
                  </a>

                  <a
                    href="https://wa.me/919381718677"
                    target="_blank"
                    className="flex items-center gap-3 hover:text-green-700 transition"
                  >
                    <FaWhatsapp className="text-green-600 text-lg" />
                    <span>
                      <strong>WhatsApp:</strong> +91 9381718677
                    </span>
                  </a>

                  <a
                    href="mailto:harishkummara767@gmail.com"
                    className="flex items-center gap-3 hover:text-blue-600 transition"
                  >
                    <FaEnvelope className="text-red-500" />
                    <span>
                      <strong>Email:</strong> harishkummara767@gmail.com
                    </span>
                  </a>

                </div>

                {/* Contact Buttons */}
                <div className="flex gap-4 mt-8">

                  <a
                    href="tel:+919381718677"
                    className="flex-1 text-center bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition"
                  >
                    Call Now
                  </a>

                  <a
                    href="https://wa.me/919381718677"
                    target="_blank"
                    className="flex-1 text-center bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp />
                    Chat on WhatsApp
                  </a>

                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}