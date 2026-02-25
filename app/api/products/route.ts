import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

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

  let imagePath = "";

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = Date.now() + "-" + file.name;

    const fs = require("fs");
    const path = require("path");

    const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

    fs.writeFileSync(uploadPath, buffer);

    imagePath = "/uploads/" + fileName;
  }

  const product = await Product.create({
    name,
    price,
    image: imagePath,
    isDelete: false,
  });

  return Response.json(product);
}