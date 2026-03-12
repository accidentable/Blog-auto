import { NextResponse } from "next/server";
import { getAuthorizationUrl } from "@/lib/threads-auth";

export async function GET() {
  try {
    const url = getAuthorizationUrl();
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
