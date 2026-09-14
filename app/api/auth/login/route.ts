import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        )
    }

    const cleanIdentifier = identifier.trim().toLowerCase()
    const supabase = await createClient()

    let email = cleanIdentifier

    if (!cleanIdentifier.includes("@")) {
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("users")
            .select("email")
            .eq("username", cleanIdentifier)
            .maybeSingle()

        if (profileError || !profile) {
            return NextResponse.json(
                { error: "Invalid email/username or password" },
                { status: 401 }
            )
        }

        email = profile.email
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error || !data.user) {
        return NextResponse.json(
            { error: "Invalid email/username or password" },
            { status: 401 }
        )
    }

    const { data: profile, error: profileError } = await supabaseAdmin
        .from("users")
        .select("id, username, email, role")
        .eq("auth_id", data.user.id)
        .single()

    if (profileError || !profile) {
        return NextResponse.json(
            { error: "User profile not found" },
            { status: 500 }
        )
    }

    return NextResponse.json({
        id: profile.id,
        username: profile.username,
        email: profile.email,
        role: profile.role
    })
}