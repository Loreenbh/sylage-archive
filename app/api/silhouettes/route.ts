import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function POST(request: Request){

    const body = await request.json()
    const { imageUrl, moodboardId } = body

    const user = await getCurrentSessionUser()
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
                user.id,
                moodboardId,
                imageUrl
            ]
        )

    return NextResponse.json(
        result.rows[0],
        {status:201}
    )} catch (err: any) {
    console.error("ERROR CREATE SILHOUETTE:", err)

    return NextResponse.json(
        {
            error: err.message,
            code: err.code,
            detail: err.detail,
            constraint: err.constraint,
        },
        { status: 500 }
    )
    }
}


export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)

  const userIdParam = searchParams.get("userId")
  const moodboardId = searchParams.get("moodboardId")
  const liked = searchParams.get("liked")

  const currentSession = await getCurrentSessionUser()
  if (!currentSession) {
    return NextResponse.json(
      {error:"Non connecté"},
      {status:401}
    )
  }

 // CAS 0 : SILHOUETTES LIKEES PAR L'UTILISATEUR

if (liked === "true") {
  try {

    const silhouettes = await pool.query(
      `
      SELECT 
        silhouettes.*,
        creator.username,
        target_user.id AS target_user_id,
        target_user.username AS target_username,
        moodboards.tags,

        COUNT(DISTINCT likes_all.id)::int AS likes_count,

        EXISTS (
          SELECT 1
          FROM likes user_likes
          WHERE user_likes.user_id = $1
          AND user_likes.silhouette_id = silhouettes.id
        ) AS liked_by_current_user

      FROM likes l

      JOIN silhouettes
      ON silhouettes.id = l.silhouette_id

      JOIN users creator
      ON creator.id = silhouettes.user_id

      JOIN moodboards
      ON moodboards.id = silhouettes.moodboard_id

      JOIN users target_user
      ON target_user.id = moodboards.user_id

      LEFT JOIN likes likes_all
      ON likes_all.silhouette_id = silhouettes.id

      WHERE l.user_id = $1

      GROUP BY 
        silhouettes.id,
        creator.username,
        target_user.id,
        target_user.username,
        moodboards.tags

      ORDER BY MAX(l.created_at) DESC
      `,
      [
        currentSession.id
      ]
    )
    return NextResponse.json({
      user: null,
      silhouettes: silhouettes.rows
    })

  } catch (err) {

    console.error("ERROR LIKED SILHOUETTES:", err)

    return NextResponse.json(
      { error: "Erreur récupération silhouettes likées" },
      { status: 500 }
    )

  }
}

  // CAS 1 : PROPOSITIONS D'UN MOODBOARD
  if (moodboardId) {
    const moodboard = await pool.query(
      `
      SELECT 
        users.id,
        users.username
      FROM moodboards

      JOIN users
      ON users.id = moodboards.user_id

      WHERE moodboards.id=$1
      `,
      [moodboardId]
    )

    if (!moodboard.rows[0]) {
      return NextResponse.json(
        {error:"Moodboard introuvable"},
        {status:404}
      )
    }

    const silhouettes = await pool.query(
      `
      SELECT 
        silhouettes.*,
        users.username,

        COUNT(likes.id)::int AS likes_count,

        EXISTS (
          SELECT 1
          FROM likes
          WHERE likes.user_id=$2
          AND likes.silhouette_id=silhouettes.id
        ) AS liked_by_current_user

      FROM silhouettes

      JOIN users
      ON users.id = silhouettes.user_id

      LEFT JOIN likes
      ON likes.silhouette_id = silhouettes.id

      WHERE silhouettes.moodboard_id=$1

      GROUP BY silhouettes.id, users.username

      ORDER BY silhouettes.created_at DESC
      `,
      [
        moodboardId,
        currentSession.id
      ]
    )
    return NextResponse.json({
      user: moodboard.rows[0],
      silhouettes: silhouettes.rows
    })
  }



  // CAS 2 : PROFIL
  const userId = userIdParam
    ? Number(userIdParam)
    : currentSession.id

  const user = await pool.query(
    `
    SELECT id, username
    FROM users
    WHERE id=$1
    `,
    [userId]
  )

  if (!user.rows[0]) {
    return NextResponse.json(
      {error:"Utilisateur introuvable"},
      {status:404}
    )
  }

  const silhouettes = await pool.query(
    `
    SELECT 
      silhouettes.*,
      users.username,
      target_user.id AS target_user_id,
      target_user.username AS target_username,
      moodboards.tags,

      COUNT(likes.id)::int AS likes_count,

      EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.user_id=$2
        AND likes.silhouette_id=silhouettes.id
      ) AS liked_by_current_user

    FROM silhouettes

    JOIN users
    ON users.id = silhouettes.user_id

    JOIN moodboards
    ON moodboards.id = silhouettes.moodboard_id

    JOIN users target_user
    ON target_user.id = moodboards.user_id

    LEFT JOIN likes
    ON likes.silhouette_id=silhouettes.id

    WHERE silhouettes.user_id=$1

    GROUP BY 
      silhouettes.id, 
      users.username,
      target_user_id,
      target_user.username,
      moodboards.tags

    ORDER BY silhouettes.created_at DESC
    `,
    [
      userId,
      currentSession.id
    ]
  )
  return NextResponse.json({
    user:user.rows[0],
    silhouettes:silhouettes.rows
  })

}



export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "ID manquant" },
      { status: 400 }
    )
  }

  const currentSession = await getCurrentSessionUser()

  if (!currentSession) {
    return NextResponse.json(
      { error: "Non connecté" },
      { status: 401 }
    )
  }

  try {
    const silhouette = await pool.query(
      `
      SELECT user_id
      FROM silhouettes
      WHERE id=$1
      `,
      [id]
    )

    if (silhouette.rows.length === 0) {
      return NextResponse.json(
        { error: "Look introuvable" },
        { status: 404 }
      )
    }

    const isOwner =
      silhouette.rows[0].user_id === currentSession.id

    const isAdmin =
      currentSession.role === "admin"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      )
    }

    await pool.query(
      `
      DELETE FROM likes
      WHERE silhouette_id=$1
      `,
      [id]
    )

    await pool.query(
      `
      DELETE FROM silhouettes
      WHERE id=$1
      `,
      [id]
    )

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error(
      "DELETE SILHOUETTE ERROR:",
      error
    )

    return NextResponse.json(
      { error: "Erreur suppression" },
      { status: 500 }
    )
  }
}