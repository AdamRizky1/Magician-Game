import { NextResponse } from "next/server";

// Force static export for GitHub Pages compatibility
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}