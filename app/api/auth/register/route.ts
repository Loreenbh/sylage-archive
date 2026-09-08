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
  console.log("[REGISTER] Request received")

  try {
    const body = await request.json()

    const { username, email, password } = body

    console.log("[REGISTER] Body received", {
      username,
      email,
      hasPassword: !!password,
    })

    // Champs obligatoires
    if (!username || !email || !password) {
      console.log("[REGISTER] Missing required fields")

      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    console.log("[REGISTER] Cleaned data", {
      username: cleanUsername,
      email: cleanEmail,
    })

    // Username
    if (
      cleanUsername.length < MIN_USERNAME_LENGTH ||
      cleanUsername.length > MAX_USERNAME_LENGTH
    ) {
      console.log("[REGISTER] Invalid username length")

      return NextResponse.json(
        {
          error: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters long`,
        },
        { status: 400 }
      )
    }

    if (!USERNAME_REGEX.test(cleanUsername)) {
      console.log("[REGISTER] Invalid username characters")

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
      console.log("[REGISTER] Invalid email format")

      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Password
    if (password.length < MIN_PASSWORD_LENGTH) {
      console.log("[REGISTER] Password too short")

      return NextResponse.json(
        {
          error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        },
        { status: 400 }
      )
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      console.log("[REGISTER] Password too long")

      return NextResponse.json(
        { error: "Password is too long" },
        { status: 400 }
      )
    }

    if (!PASSWORD_REGEX.test(password)) {
      console.log("[REGISTER] Password format invalid")

      return NextResponse.json(
        {
          error:
            "Password must contain at least a letter, a number, and a special character",
        },
        { status: 400 }
      )
    }

    console.log("[REGISTER] Validation passed")

    // Vérifie si le username existe déjà
    console.log("[REGISTER] Checking username availability")

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
      console.log("[REGISTER] Username already exists")

      return NextResponse.json(
        { error: "Username or email is already in use" },
        { status: 409 }
      )
    }

    console.log("[REGISTER] Username available")

    // Vérifie si l'email existe déjà
    console.log("[REGISTER] Checking email availability")

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
      console.log("[REGISTER] Email already exists")

      return NextResponse.json(
        { error: "Username or email is already in use" },
        { status: 409 }
      )
    }

    console.log("[REGISTER] Email available")

    // Création du compte Supabase Auth
    console.log("[REGISTER] Calling Supabase Auth signUp")

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
        },
      },
    })

    console.log("[REGISTER] Supabase signUp response", {
      hasUser: !!data.user,
      userId: data.user?.id,
      identitiesCount: data.user?.identities?.length,
      errorCode: error?.code,
      errorMessage: error?.message,
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
        console.log("[REGISTER] Email already exists in Supabase Auth")

        return NextResponse.json(
          { error: "Username or email is already in use" },
          { status: 409 }
        )
      }

      // Limite d'envoi des emails
      if (error.code === "over_email_send_rate_limit") {
        console.log("[REGISTER] Email rate limit reached")

        return NextResponse.json(
          {
            error:
              "Too many registration attempts. Please try again later.",
          },
          { status: 429 }
        )
      }

      console.error("[REGISTER] Unhandled Supabase error")

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }

    // Supabase peut ne pas retourner d'erreur lorsqu'un email existe déjà
    if (data.user && data.user.identities?.length === 0) {
      console.log("[REGISTER] Email already exists - empty identities")

      return NextResponse.json(
        { error: "Username or email is already in use" },
        { status: 409 }
      )
    }

    console.log("[REGISTER] Registration successful", {
      userId: data.user?.id,
      username: cleanUsername,
      email: cleanEmail,
    })

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