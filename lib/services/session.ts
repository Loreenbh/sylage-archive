import { cookies } from "next/headers"
import { pool } from "@/lib/db"

export async function getCurrentSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (!token) {
    return null
  }
  const result = await pool.query(
    `
    SELECT user_id
    FROM sessions
    WHERE token=$1
    AND expires_at > NOW()
    `,
    [token]
  )
  return result.rows[0] ?? null
}