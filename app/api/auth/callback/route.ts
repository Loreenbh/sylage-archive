import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[AUTH CALLBACK] Error:", error);

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const redirectUrl = new URL("/", request.url);

  if (next === "update") {
    redirectUrl.searchParams.set("auth", "update");
  }

  return NextResponse.redirect(redirectUrl);
}
