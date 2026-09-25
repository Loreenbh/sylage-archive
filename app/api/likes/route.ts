import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function POST(request: Request) {
  const body = await request.json();
  const { moodboardId, silhouetteId } = body;

  if (!moodboardId && !silhouetteId) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  }

  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Non connecte" }, { status: 401 });
  }

  if (moodboardId) {
    const moodboard = await pool.query(
      `
            SELECT user_id
            FROM moodboards
            WHERE id = $1
            `,
      [moodboardId],
    );

    if (moodboard.rows[0]?.user_id === user.id) {
      return NextResponse.json(
        { error: "Impossible de liker son propre moodboard" },
        { status: 403 },
      );
    }
  }

  if (silhouetteId) {
    const silhouette = await pool.query(
      `
            SELECT user_id
            FROM silhouettes
            WHERE id = $1
            `,
      [silhouetteId],
    );

    if (silhouette.rows[0]?.user_id === user.id) {
      return NextResponse.json(
        { error: "Impossible de liker sa propre silhouette" },
        { status: 403 },
      );
    }
  }

  try {
    const result = await pool.query(
      `
            INSERT INTO likes
            (user_id, moodboard_id, silhouette_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
      [user.id, moodboardId ?? null, silhouetteId ?? null],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "DEJA LIKE" }, { status: 409 });
    }

    console.error(err);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { moodboardId, silhouetteId } = body;

  if (!moodboardId && !silhouetteId) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  }

  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Non connecte" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `
            DELETE FROM likes
            WHERE user_id = $1
            AND (
                moodboard_id = $2
                OR
                silhouette_id = $3
            )
            RETURNING *
            `,
      [user.id, moodboardId ?? null, silhouetteId ?? null],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "DEJA LIKE" }, { status: 409 });
    }

    console.error(err);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
