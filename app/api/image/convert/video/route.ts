import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "This endpoint accepts POST requests only. Use POST to convert images to video.",
    method: "POST"
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // do your image → video logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing video conversion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
