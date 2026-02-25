import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// GET ALL PRODUCTS
export async function GET() {
  await connectDB();

  const products = await Product.find({
    isDelete: false,
  }).sort({ createdAt: -1 });

  return NextResponse.json(products);
}

// CREATE PRODUCT
export async function POST(req: Request) {
  await connectDB();

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    return NextResponse.json(
      { message: "Image is required" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Cloudinary
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "my-store" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

  const product = await Product.create({
    name,
    price,
    image: uploadResult.secure_url,
    isDelete: false,
  });

  return NextResponse.json(product, { status: 201 });
}