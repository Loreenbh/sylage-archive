/*/api/moodboards/[id]
    GET     → détail d'un moodboard
    DELETE  → supprimer un moodboard
*/
import { cookies } from "next/headers";
import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id:string }> }
) {

  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  const session = await pool.query(
    `
    SELECT user_id
    FROM sessions
    WHERE token=$1
    AND expires_at > NOW()
    `,
    [token]
  )

  const currentSession = session.rows[0]


  if (!currentSession) {
    return NextResponse.json(
      { error:"Non connecté" },
      { status:401 }
    )
  }


  const result = await pool.query(
    `
    SELECT 
      moodboards.*,
      users.username,

      COUNT(DISTINCT likes.id)::int AS likes_count,

      COUNT(DISTINCT silhouettes.id)::int AS silhouettes_count,

      EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.moodboard_id = moodboards.id
        AND likes.user_id = $2
      ) AS liked_by_current_user

    FROM moodboards

    JOIN users
    ON users.id = moodboards.user_id

    LEFT JOIN likes
    ON likes.moodboard_id = moodboards.id

    LEFT JOIN silhouettes
    ON silhouettes.moodboard_id = moodboards.id

    WHERE moodboards.id = $1

    GROUP BY moodboards.id, users.username
    `,
    [
      id,
      currentSession.user_id
    ]
  )


  return NextResponse.json(result.rows[0])
}