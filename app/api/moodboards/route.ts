/*
/api/moodboards
    GET     → feed discover (tous les moodboards)
    POST    → publier un moodboard
*/

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
   const body = await request.json()

   const { imageUrl, tags } = body

   if (!imageUrl) {
      return NextResponse.json(
        { error: "Image manquante" },
        { status: 400 }
      )
   }

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

   const user = session.rows[0]

   if (!user) {
      return NextResponse.json(
        { error: "Non connecté" },
        { status: 401 }
      )
   }

   const result = await pool.query(
      `
      INSERT INTO moodboards
      (
        user_id,
        image_url,
        tags
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        user.user_id,
        imageUrl,
        tags
      ]
   )

   return NextResponse.json(result.rows[0], {
      status: 201
   })
}



export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const userIdParam = searchParams.get("userId")

    /* RECUPERATION DE LA SESSION */
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    const session = await pool.query(
        `SELECT user_id
        FROM sessions
        WHERE token=$1
        AND expires_at > NOW()
        `,
        [token]
    )
    const currentSession = session.rows[0]


    if (!currentSession) {
        return NextResponse.json(
        { error: "Non connecté" },
        { status: 401 }
        )
    }


    const userId = userIdParam
      ? Number(userIdParam)
      : currentSession.user_id

    const user = await pool.query(
      `
      SELECT id, username
      FROM users
      WHERE id=$1
      `,
      [userId]
    )

  const result = await pool.query(
    `
    SELECT 
      moodboards.*,

      users.username,

      COUNT(likes.id)::int AS likes_count,
      COUNT(DISTINCT silhouettes.id)::int AS silhouettes_count,

      EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.user_id = $2
        AND likes.moodboard_id = moodboards.id
      ) AS liked_by_current_user


    FROM moodboards


    JOIN users
    ON users.id = moodboards.user_id


    LEFT JOIN likes
    ON likes.moodboard_id = moodboards.id

    LEFT JOIN silhouettes
    ON silhouettes.moodboard_id = moodboards.id

    WHERE moodboards.user_id = $1


    GROUP BY 
      moodboards.id,
      users.username


    ORDER BY moodboards.created_at DESC
    `,
    [
      userId,
      currentSession.user_id
    ]
  )
    return NextResponse.json({
      user: user.rows[0],
      moodboards: result.rows
  })
}
