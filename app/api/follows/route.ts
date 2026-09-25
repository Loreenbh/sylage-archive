import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");

  const currentSession = await getCurrentSessionUser();

  // Si aucun userId n'est fourni,
  // on demande le profil de l'utilisateur connecté.
  // Un Guest ne peut donc pas utiliser ce mode.
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
  const body = await request.json();
  const { userId } = body;

  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }
  if (!userId) {
    return NextResponse.json(
      { error: "Utilisateur manquant" },
      { status: 400 },
    );
  }
  await pool.query(
    `
    INSERT INTO follows
    (
      follower_id,
      following_id
    )
    VALUES($1,$2)
    ON CONFLICT DO NOTHING
    `,
    [currentUser.id, userId],
  );
  return NextResponse.json({
    success: true,
  });
}

// UNFOLLOW
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  await pool.query(
    `
    DELETE FROM follows
    WHERE follower_id=$1
    AND following_id=$2
    `,
    [currentUser.id, userId],
  );
  return NextResponse.json({
    success: true,
  });
}
