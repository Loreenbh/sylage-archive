import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";
import { createClient } from "@/lib/server";

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 15;

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");

  const currentSession = await getCurrentSessionUser();

  if (!userIdParam && !currentSession) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const userId = userIdParam ? Number(userIdParam) : currentSession!.id;

  const user = await pool.query(
    `
        SELECT id, username, avatar_url
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

  const moodboards = await pool.query(
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

        WHERE moodboards.user_id=$1

        GROUP BY 
            moodboards.id,
            users.username

        ORDER BY moodboards.created_at DESC
        `,
    [userId, currentSession?.id ?? null],
  );

  const silhouettes = await pool.query(
    `
        SELECT
            silhouettes.*,
            users.username,

            COUNT(likes.id)::int AS likes_count,

            EXISTS (
                SELECT 1
                FROM likes
                WHERE likes.silhouette_id = silhouettes.id
                AND likes.user_id = $2
            ) AS liked_by_current_user

        FROM silhouettes

        JOIN users
        ON users.id = silhouettes.user_id

        LEFT JOIN likes
        ON likes.silhouette_id = silhouettes.id

        WHERE silhouettes.user_id=$1

        GROUP BY
            silhouettes.id,
            users.username

        ORDER BY silhouettes.created_at DESC
        `,
    [userId, currentSession?.id ?? null],
  );

  return NextResponse.json({
    user: user.rows[0],
    moodboards: moodboards.rows,
    silhouettes: silhouettes.rows,
  });
}

export async function PATCH(request: Request) {
  let body: { avatar_url?: unknown; username?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { avatar_url, username, password } = body;

  if (
    (avatar_url !== undefined && avatar_url !== null && typeof avatar_url !== "string") ||
    (username !== undefined && username !== null && typeof username !== "string") ||
    (password !== undefined && password !== null && typeof password !== "string")
  ) {
    return NextResponse.json({ error: "Format des données invalide" }, { status: 400 });
  }

  const normalizedUsername = typeof username === "string" ? username.trim() : username;

  if (typeof normalizedUsername === "string" && normalizedUsername.length === 0) {
    return NextResponse.json({ error: "Le nom d'utilisateur ne peut pas être vide" }, { status: 400 });
  }

  const currentSession = await getCurrentSessionUser();
  if (!currentSession) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  let updatedUser = null;

  if (normalizedUsername) {
    if (normalizedUsername.length < 3) {
      return NextResponse.json(
        {
          error: `Username must be at least ${MIN_USERNAME_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    if (normalizedUsername.length > MAX_USERNAME_LENGTH) {
      return NextResponse.json(
        {
          error: `Username must be less than ${MAX_USERNAME_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    const existing = await pool.query(
      `
            SELECT id
            FROM users
            WHERE username=$1
            AND id != $2
            `,
      [normalizedUsername, currentSession.id],
    );

    if (existing.rows[0]) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }
  }

  if (password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          error: `Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères`,
        },
        { status: 400 },
      );
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          error: "Le mot de passe est trop long",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Impossible de modifier le mot de passe" },
        { status: 500 },
      );
    }
  }
  if (avatar_url || username) {
    updatedUser = await pool.query(
      `
            UPDATE users

            SET
                avatar_url = COALESCE($1, avatar_url),
                username = COALESCE($2, username)

            WHERE id=$3

            RETURNING id, username, avatar_url
            `,
      [avatar_url ?? null, normalizedUsername ?? null, currentSession.id],
    );
  }

  if (updatedUser) {
    return NextResponse.json({
      user: updatedUser.rows[0],
    });
  }

  const user = await pool.query(
    `
        SELECT id, username, avatar_url
        FROM users
        WHERE id=$1
        `,
    [currentSession.id],
  );
  return NextResponse.json({
    user: user.rows[0],
  });
}

export async function DELETE() {
  const currentSession = await getCurrentSessionUser();
  if (!currentSession) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }
  await pool.query(
    `
    DELETE FROM users
    WHERE id=$1
    `,
    [currentSession.id],
  );
  return NextResponse.json({
    success: true,
  });
}
