import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),   // expire immediately
    path: "/",              // must match login path
  });

  return response;
}