import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function POST(request: Request){

    const body = await request.json()
    const { imageUrl, moodboardId } = body


    /* AUTHENTIFICATION */
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if (!token){
        return NextResponse.json(
            {error:"Non connecte"},
            {status:401}
        )
    }

    const session = await pool.query(
        `SELECT user_id
        FROM sessions
        WHERE token=$1
        AND expires_at > NOW()
        `,
        [token]
    )

    const user = session.rows[0]

    if (!user){
        return NextResponse.json(
            {error:"Session invalide"},
            {status:401}
        )
    }


    /* VALIDATION */

    if (!imageUrl || !moodboardId){
        return NextResponse.json(
            {error:'Champs manquants'},
            {status: 400}
        )
    }

    try{
        const result = await pool.query(
            `
            INSERT INTO silhouettes
            (user_id, moodboard_id, image_url)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                user.user_id,
                moodboardId,
                imageUrl
            ]
        )

    return NextResponse.json(
        result.rows[0],
        {status:201}
    )}catch (err:any) {
        if (err.code === '23514'){
            return NextResponse.json(
                {error: 'Il faut entre 3 et 5 tags'},
                {status: 400}
            )
        }
        console.error(err)
        return NextResponse.json(
            {error: 'Erreur serveur'},
            {status: 500}
        )
    }
}

export async function GET(request: Request){

  const { searchParams } = new URL(request.url)
  const username = searchParams.get("user")
  const tag = searchParams.get("tag")

  const moodboardId = searchParams.get("moodboard")

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
      { error: "Non connecté" },
      { status: 401 }
    )
  }

  if (moodboardId){

    const result = await pool.query(
      `
      SELECT 
        silhouettes.*,
        users.username,
        moodboards.tags,

        COUNT(likes.id)::int AS likes_count,

        EXISTS (
          SELECT FROM likes
          WHERE likes.user_id = $2
          AND likes.silhouette_id = silhouettes.id
        ) AS liked_by_current_user

      FROM silhouettes

      JOIN users
      ON users.id = silhouettes.user_id

      JOIN moodboards
      ON moodboards.id = silhouettes.moodboard_id

      LEFT JOIN likes
      ON likes.silhouette_id = silhouettes.id

      WHERE silhouettes.moodboard_id = $1

      GROUP BY silhouettes.id, users.username, moodboards.tags

      ORDER BY silhouettes.created_at DESC
      `,
      [
        moodboardId,
        currentSession.user_id
      ]
    )

    return NextResponse.json(result.rows)
  }

  let userId


  if (!username) {
    userId = currentSession.user_id
  } else {

    const requestedUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE username=$1
      `,
      [username]
    )

    if (!requestedUser.rows[0]) {
      return NextResponse.json(
        {error:"Utilisateur introuvable"},
        {status:404}
      )
    }

    userId = requestedUser.rows[0].id
  }


  let query = `
    SELECT 
      silhouettes.*, 
      users.username, 
      moodboards.tags,
      COUNT(likes.id)::int AS likes_count,
      EXISTS (
        SELECT FROM likes
        WHERE likes.user_id = $2
        AND likes.silhouette_id = silhouettes.id
      ) AS liked_by_current_user

    FROM silhouettes

    JOIN users
    ON users.id = silhouettes.user_id

    JOIN moodboards
    ON moodboards.id = silhouettes.moodboard_id

    LEFT JOIN likes
    ON likes.silhouette_id = silhouettes.id

    WHERE silhouettes.user_id = $1
  `


  const values:any[] = [
    userId,
    currentSession.user_id
  ]


  if(tag){
    query += `
      AND $3 = ANY(moodboards.tags)
    `
    values.push(tag)
  }


  query += `
    GROUP BY silhouettes.id, users.username, moodboards.tags
    ORDER BY silhouettes.created_at DESC
  `


  const result = await pool.query(
    query,
    values
  )


  return NextResponse.json(result.rows)
}


export async function DELETE(request: Request){
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if(!id){
    return NextResponse.json(
      {error:"Missing id"},
      {status:400}
    )
  }

      /* AUTHENTIFICATION */
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if (!token){
        return NextResponse.json(
            {error:"Non connecte"},
            {status:401}
        )
    }

    const session = await pool.query(
        `SELECT user_id
        FROM sessions
        WHERE token=$1
        AND expires_at > NOW()
        `,
        [token]
    )

    const user = session.rows[0]

    if (!user){
        return NextResponse.json(
            {error:"Session invalide"},
            {status:401}
        )
    }


  await pool.query(
    `
    DELETE FROM silhouettes
    WHERE id=$1
    AND user_id=$2
    `,
    [id,
      user.user_id
    ]
  )


  return NextResponse.json({
    success:true
  })
}