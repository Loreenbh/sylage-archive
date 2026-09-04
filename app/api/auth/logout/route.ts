import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function POST() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error(error)

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true })
}