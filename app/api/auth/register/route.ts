import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 15
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 35

export async function POST(request: Request) {
    const body = await request.json()
    const { username, email, password } = body

    if (!username || !email || !password) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        )
    }

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

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
                error: "Username can only contain letters, numbers and underscores",
            },
            { status: 400 }
        )
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
        return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 }
        )
    }

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
                error: "Password must contain at least a letter, a number, and a special character",
            },
            { status: 400 }
        )
    }

    const supabase = await createClient()

    // Vérifie que le username n'est pas déjà utilisé
    const { data: existingUsername } = await supabase
        .from("users")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle()

    if (existingUsername) {
        return NextResponse.json(
            { error: "Username or email is already in use" },
            { status: 409 }
        )
    }

    const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
            data: {
                username: cleanUsername,
            },
        },
    })

    if (error) {
        console.error(error)

        if (error.message.toLowerCase().includes("already registered")) {
            return NextResponse.json(
                { error: "Username or email is already in use" },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
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
}