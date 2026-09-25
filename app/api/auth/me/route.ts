import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  const { data: profile, error } = await supabaseAdmin
    .from("users")
    .select("id, email, username, avatar_url, role")
    .eq("auth_id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: profile,
  });
}
