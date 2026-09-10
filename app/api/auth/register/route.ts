import { NextResponse } from "next/server"

import { createClient } from "@/lib/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 15

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 35

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { username, email, password } = body

    // Champs obligatoires
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    // Username
    if (
      cleanUsername.length < MIN_USERNAME_LENGTH ||
      cleanUsername.length > MAX_USERNAME_LENGTH
    ) {
      return NextResponse.json(
        {
          error: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters long`,
        },
        { status: 400 }
      )
    }

    if (!USERNAME_REGEX.test(cleanUsername)) {
      return NextResponse.json(
        {
          error:
            "Username can only contain letters, numbers and underscores",
        },
        { status: 400 }
      )
    }

    // Email
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Password
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        },
        { status: 400 }
      )
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: "Password is too long" },
        { status: 400 }
      )
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must contain at least a letter, a number, and a special character",
        },
        { status: 400 }
      )
    }

    // Vérifie si le username existe déjà
    const { data: existingUsername, error: usernameError } =
      await supabaseAdmin
        .from("users")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle()

    if (usernameError) {
      console.error("[REGISTER] Username check error:", usernameError)

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username or email is already in use" },
        { status: 409 }
      )
    }

    // Vérifie si l'email existe déjà
    const { data: existingEmail, error: emailError } =
      await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle()

    if (emailError) {
      console.error("[REGISTER] Email check error:", emailError)

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }

    if (existingEmail) {
      return NextResponse.json(
        { error: "Username or email is already in use" },
        { status: 409 }
      )
    }

    // Création du compte Supabase Auth
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          username: cleanUsername,
        },
      },
    })

    if (error) {
      const errorMessage = error.message.toLowerCase()

      console.error("[REGISTER] Supabase Auth error:", {
        code: error.code,
        message: error.message,
      })

      // Email déjà utilisé
      if (
        error.code === "user_already_exists" ||
        errorMessage.includes("already registered") ||
        errorMessage.includes("already exists") ||
        errorMessage.includes("user already")
      ) {
        return NextResponse.json(
          { error: "Username or email is already in use" },
          { status: 409 }
        )
      }

      // Limite d'envoi des emails
      if (error.code === "over_email_send_rate_limit") {
        return NextResponse.json(
          {
            error:
              "Too many registration attempts. Please try again later.",
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }

    // Supabase peut ne pas retourner d'erreur lorsqu'un email existe déjà
    if (data.user && data.user.identities?.length === 0) {
      return NextResponse.json(
        { error: "Username or email is already in use" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        id: data.user?.id,
        username: cleanUsername,
        email: cleanEmail,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[REGISTER] Unexpected error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

