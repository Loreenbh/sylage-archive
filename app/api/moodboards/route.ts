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

    const res = await pool.query(
      `
      SELECT moodboards.*, 
      users.username, 
      COUNT(likes.id)::int AS "likes_count",
      EXISTS (
          SELECT FROM likes 
          WHERE likes.user_id = $1 
          AND likes.moodboard_id = moodboards.id
      ) AS liked_by_current_user
      FROM moodboards
      JOIN users
      ON users.id = moodboards.user_id
      LEFT JOIN likes
      ON likes.moodboard_id = moodboards.id
      WHERE moodboards.user_id = $1
      GROUP BY moodboards.id, users.username
      ORDER BY moodboards.created_at DESC
      `,
      [currentSession.user_id]
    )
  return NextResponse.json(res.rows)

}

// export async function DELETE(request: Request){
//   const { searchParams } = new URL(request.url)
//   const id = searchParams.get("id")

//   if(!id){
//     return NextResponse.json(
//       {error:"Missing id"},
//       {status:400}
//     )
//   }

//       /* AUTHENTIFICATION */
//     const cookieStore = await cookies()
//     const token = cookieStore.get("session_token")?.value

//     if (!token){
//         return NextResponse.json(
//             {error:"Non connecte"},
//             {status:401}
//         )
//     }

//     const session = await pool.query(
//         `SELECT user_id
//         FROM sessions
//         WHERE token=$1
//         AND expires_at > NOW()
//         `,
//         [token]
//     )

//     const user = session.rows[0]

//     if (!user){
//         return NextResponse.json(
//             {error:"Session invalide"},
//             {status:401}
//         )
//     }


//   await pool.query(
//     `
//     DELETE FROM moodboards
//     WHERE id=$1
//     AND user_id=$2
//     `,
//     [id,
//       user.user_id
//     ]
//   )


//   return NextResponse.json({
//     success:true
//   })
// }