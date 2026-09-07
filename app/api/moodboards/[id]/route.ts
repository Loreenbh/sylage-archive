import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { getCurrentSessionUser } from "@/lib/services/session"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id:string }> }
) {

  const { id } = await params
  const currentSession = await getCurrentSessionUser()

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
      currentSession.id
    ]
  )
  return NextResponse.json(result.rows[0])
}