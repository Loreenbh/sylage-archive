import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function POST(request: Request) {
  let body: { imageUrl?: unknown; tags?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { imageUrl, tags } = body;

  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return NextResponse.json({ error: "Image manquante ou invalide" }, { status: 400 });
  }

  if (tags !== undefined && tags !== null && !Array.isArray(tags)) {
    return NextResponse.json({ error: "Format des tags invalide" }, { status: 400 });
  }

  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
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
    [user.id, imageUrl.trim(), tags ?? null],
  );

  return NextResponse.json(result.rows[0], {
    status: 201,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userIdParam = searchParams.get("userId");
  const liked = searchParams.get("liked");

  const currentSession = await getCurrentSessionUser();

  if (liked === "true") {
    if (!currentSession) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    try {
      const moodboards = await pool.query(
        `
        SELECT 
          moodboards.*,
          users.username,

          COUNT(DISTINCT likes_all.id)::int AS likes_count,
          COUNT(DISTINCT silhouettes.id)::int AS silhouettes_count,

          EXISTS (
            SELECT 1
            FROM likes user_likes
            WHERE user_likes.user_id = $1
            AND user_likes.moodboard_id = moodboards.id
          ) AS liked_by_current_user

        FROM likes l

        JOIN moodboards
        ON moodboards.id = l.moodboard_id

        JOIN users
        ON users.id = moodboards.user_id

        LEFT JOIN likes likes_all
        ON likes_all.moodboard_id = moodboards.id

        LEFT JOIN silhouettes
        ON silhouettes.moodboard_id = moodboards.id

        WHERE l.user_id = $1

        GROUP BY
          moodboards.id,
          users.username

        ORDER BY MAX(l.created_at) DESC
        `,
        [currentSession.id],
      );

      return NextResponse.json({
        user: null,
        moodboards: moodboards.rows,
      });
    } catch (err) {
      console.error("ERROR LIKED MOODBOARDS:", err);

      return NextResponse.json(
        { error: "Erreur récupération moodboards likés" },
        { status: 500 },
      );
    }
  }

  if (!userIdParam && !currentSession) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const userId = userIdParam ? Number(userIdParam) : currentSession!.id;

  const user = await pool.query(
    `
    SELECT id, username
    FROM users
    WHERE id=$1
    `,
    [userId],
  );

  if (user.rows.length === 0) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 },
    );
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
    [userId, currentSession?.id ?? null],
  );

  return NextResponse.json({
    user: user.rows[0],
    moodboards: result.rows,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const idParam = searchParams.get("id");
  const id = idParam && /^[1-9]\d*$/.test(idParam) ? Number(idParam) : NaN;

  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const currentSession = await getCurrentSessionUser();

  if (!currentSession) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  try {
    const moodboard = await pool.query(
      `
      SELECT user_id
      FROM moodboards
      WHERE id=$1
      `,
      [id],
    );

    if (moodboard.rows.length === 0) {
      return NextResponse.json(
        { error: "Moodboard introuvable" },
        { status: 404 },
      );
    }

    const isOwner = Number(moodboard.rows[0].user_id) === Number(currentSession.id);

    const isAdmin = currentSession.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await pool.query(
      `
      DELETE FROM likes
      WHERE moodboard_id=$1
      `,
      [id],
    );

    await pool.query(
      `
      DELETE FROM moodboards
      WHERE id=$1
      `,
      [id],
    );
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE MOODBOARD ERROR:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
