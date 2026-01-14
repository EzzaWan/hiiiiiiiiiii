import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "This endpoint accepts POST requests only. Use POST to convert images to video.",
    method: "POST"
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  // do your image → video logic here
  return NextResponse.json({ success: true });
}
