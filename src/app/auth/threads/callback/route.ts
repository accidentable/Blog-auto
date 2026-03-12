import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?threads_error=${error}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/settings?threads_error=no_code", request.url)
    );
  }

  // Exchange code for token server-side
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const tokenRes = await fetch(`${baseUrl}/api/threads/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!tokenRes.ok) {
      throw new Error("Token exchange failed");
    }

    return NextResponse.redirect(
      new URL("/settings?threads_connected=true", request.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/settings?threads_error=token_exchange_failed", request.url)
    );
  }
}
