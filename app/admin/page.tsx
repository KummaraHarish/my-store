import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    if (decoded.role !== "admin") {
      redirect("/admin/login");
    }

  } catch {
    redirect("/admin/login");
  }

  return <AdminClient />;
}