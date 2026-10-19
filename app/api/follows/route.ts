import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");

  const currentSession = await getCurrentSessionUser();

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

  // PERSONNES QUE L'UTILISATEUR SUIT
  const following = await pool.query(
    `
    SELECT 
      users.id,
      users.username,
      users.avatar_url,

      EXISTS (
        SELECT 1
        FROM follows f2
        WHERE f2.follower_id = $2
        AND f2.following_id = users.id
      ) AS is_followed

    FROM follows

    JOIN users
    ON users.id = follows.following_id

    WHERE follows.follower_id = $1

    ORDER BY follows.created_at DESC
    `,
    [userId, currentSession?.id ?? null],
  );

  // PERSONNES QUI SUIVENT L'UTILISATEUR
  const followers = await pool.query(
    `
    SELECT 
      users.id,
      users.username,
      users.avatar_url,

      EXISTS (
        SELECT 1
        FROM follows f2
        WHERE f2.follower_id = $2
        AND f2.following_id = users.id
      ) AS is_followed

    FROM follows

    JOIN users
    ON users.id = follows.follower_id

    WHERE follows.following_id = $1

    ORDER BY follows.created_at DESC
    `,
    [userId, currentSession?.id ?? null],
  );

  return NextResponse.json({
    user: user.rows[0],
    following: following.rows,
    followers: followers.rows,
  });
}

// FOLLOW
export async function POST(request: Request) {
  let body: { userId?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const targetId =
    typeof body.userId === "number"
      ? body.userId
      : typeof body.userId === "string" && /^\d+$/.test(body.userId)
        ? Number(body.userId)
        : NaN;

  if (!Number.isSafeInteger(targetId) || targetId <= 0) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  if (Number(currentUser.id) === targetId) {
    return NextResponse.json({ error: "Tu ne peux pas te suivre toi-même" }, { status: 400 });
  }

  try {
    const target = await pool.query("SELECT id FROM users WHERE id = $1", [targetId]);
    if (!target.rows[0]) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const result = await pool.query(
      `
        INSERT INTO follows (follower_id, following_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING follower_id
      `,
      [currentUser.id, targetId],
    );

    return NextResponse.json({ success: true, followed: (result.rowCount ?? 0) > 0 });
  } catch (error) {
    console.error("CREATE FOLLOW ERROR:", error);
    return NextResponse.json({ error: "Impossible de suivre ce profil pour le moment" }, { status: 500 });
  }
}

// UNFOLLOW
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");
  const targetId = userIdParam && /^\d+$/.test(userIdParam) ? Number(userIdParam) : NaN;

  if (!Number.isSafeInteger(targetId) || targetId <= 0) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM follows
        WHERE follower_id = $1
          AND following_id = $2
        RETURNING follower_id
      `,
      [currentUser.id, targetId],
    );

    return NextResponse.json({ success: true, unfollowed: (result.rowCount ?? 0) > 0 });
  } catch (error) {
    console.error("DELETE FOLLOW ERROR:", error);
    return NextResponse.json({ error: "Impossible de modifier cet abonnement pour le moment" }, { status: 500 });
  }
}
