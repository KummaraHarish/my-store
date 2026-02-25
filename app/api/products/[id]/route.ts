import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ✅ UPDATE PRODUCT
export async function PUT(
req: Request,
context: { params: Promise<{ id: string }> }
) {
await connectDB();

const { id } = await context.params;

const formData = await req.formData();

const name = formData.get("name") as string;
const price = formData.get("price") as string;
const file = formData.get("image") as File;

let updateData: any = {
name,
price,
};

// ✅ Only update image if new file is selected
if (file && file.size > 0) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");

  // create folder if not exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.promises.writeFile(filePath, buffer); // ✅ IMPORTANT

  updateData.image = `/uploads/${fileName}`;
}

const updatedProduct = await Product.findByIdAndUpdate(
id,
updateData,
{ new: true }
);

return NextResponse.json({
success: true,
product: updatedProduct,
});
}

// ✅ SOFT DELETE
export async function DELETE(
req: Request,
context: { params: Promise<{ id: string }> }
) {
await connectDB();

const { id } = await context.params; // ✅ unwrap here

await Product.findByIdAndUpdate(
id, // ✅ use id NOT params.id
{ isDelete: true },
{ new: true }
);

return NextResponse.json({
success: true,
message: "Product soft deleted successfully",
});
}