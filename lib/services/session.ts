import { createClient } from "@/lib/server"
import { pool } from "@/lib/db"

export async function getCurrentSessionUser() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const result = await pool.query(
        `
        SELECT id, username, email, role
        FROM users
        WHERE auth_id = $1
        `,
        [user.id]
    )

    return result.rows[0] ?? null
}