import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function POST(request: Request) {
  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  let body: { imageUrl?: unknown; moodboardId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { imageUrl, moodboardId } = body;
  const parsedMoodboardId =
    typeof moodboardId === "number"
      ? moodboardId
      : typeof moodboardId === "string" && /^\d+$/.test(moodboardId)
        ? Number(moodboardId)
        : NaN;

  if (
    typeof imageUrl !== "string" ||
    !imageUrl.trim() ||
    !Number.isSafeInteger(parsedMoodboardId) ||
    parsedMoodboardId <= 0
  ) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }

  try {
    // Moodboards are collaborative: any authenticated user may contribute a look.
    // Confirm the target exists without restricting contributions to its owner.
    const moodboard = await pool.query(
      "SELECT id FROM moodboards WHERE id = $1",
      [parsedMoodboardId],
    );

    if (!moodboard.rows[0]) {
      return NextResponse.json({ error: "Moodboard introuvable" }, { status: 404 });
    }

    const result = await pool.query(
      `
        INSERT INTO silhouettes
        (user_id, moodboard_id, image_url)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [user.id, parsedMoodboardId, imageUrl.trim()],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("ERROR CREATE SILHOUETTE:", error);

    return NextResponse.json(
      { error: "Impossible de publier ce look pour le moment" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const userIdParam = searchParams.get("userId");
  const moodboardId = searchParams.get("moodboardId");
  const liked = searchParams.get("liked");

  const currentSession = await getCurrentSessionUser();

  if (liked === "true") {
    if (!currentSession) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

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
        [currentSession.id],
      );

      return NextResponse.json({
        user: null,
        silhouettes: silhouettes.rows,
      });
    } catch (err) {
      console.error("ERROR LIKED SILHOUETTES:", err);

      return NextResponse.json(
        { error: "Erreur récupération silhouettes likées" },
        { status: 500 },
      );
    }
  }

  if (moodboardId !== null) {
    const parsedMoodboardId = Number(moodboardId);
    if (
      !/^[1-9]\d*$/.test(moodboardId) ||
      !Number.isSafeInteger(parsedMoodboardId)
    ) {
      return NextResponse.json({ error: "Identifiant moodboard invalide" }, { status: 400 });
    }

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
      [parsedMoodboardId],
    );

    if (!moodboard.rows[0]) {
      return NextResponse.json(
        { error: "Moodboard introuvable" },
        { status: 404 },
      );
    }

    const silhouettes = await pool.query(
      `
      SELECT 
        silhouettes.*,
        users.username,

        COUNT(DISTINCT likes.id)::int AS likes_count,

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
      [parsedMoodboardId, currentSession?.id ?? null],
    );

    return NextResponse.json({
      user: moodboard.rows[0],
      silhouettes: silhouettes.rows,
    });
  }

  if (userIdParam !== null) {
    const parsedUserId = Number(userIdParam);
    if (
      !/^[1-9]\d*$/.test(userIdParam) ||
      !Number.isSafeInteger(parsedUserId)
    ) {
      return NextResponse.json({ error: "Identifiant utilisateur invalide" }, { status: 400 });
    }
  }

  if (!userIdParam && !currentSession) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const userId = userIdParam !== null ? Number(userIdParam) : currentSession!.id;

  const user = await pool.query(
    `
    SELECT id, username
    FROM users
    WHERE id=$1
    `,
    [userId],
  );

  if (!user.rows[0]) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 },
    );
  }

  const silhouettes = await pool.query(
    `
    SELECT 
      silhouettes.*,
      users.username,
      target_user.id AS target_user_id,
      target_user.username AS target_username,
      moodboards.tags,

      COUNT(DISTINCT likes.id)::int AS likes_count,

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
    [userId, currentSession?.id ?? null],
  );

  return NextResponse.json({
    user: user.rows[0],
    silhouettes: silhouettes.rows,
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
    const silhouette = await pool.query(
      `
      SELECT user_id
      FROM silhouettes
      WHERE id=$1
      `,
      [id],
    );

    if (silhouette.rows.length === 0) {
      return NextResponse.json({ error: "Look introuvable" }, { status: 404 });
    }

    const isOwner = Number(silhouette.rows[0].user_id) === Number(currentSession.id);

    const isAdmin = currentSession.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await pool.query(
      `
      DELETE FROM likes
      WHERE silhouette_id=$1
      `,
      [id],
    );

    await pool.query(
      `
      DELETE FROM silhouettes
      WHERE id=$1
      `,
      [id],
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE SILHOUETTE ERROR:", error);

    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
