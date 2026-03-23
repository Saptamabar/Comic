import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  let folder = "revolusi45/agents";
  try {
    const body = await req.json();
    if (body.folder) folder = body.folder;
  } catch (err) {}

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder }, 
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({ signature, timestamp, folder });
}