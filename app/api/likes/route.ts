import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function POST(request: Request) {
  let body: { moodboardId?: unknown; silhouetteId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { moodboardId, silhouetteId } = body;

  const hasMoodboard = moodboardId !== undefined && moodboardId !== null;
  const hasSilhouette = silhouetteId !== undefined && silhouetteId !== null;
  if (hasMoodboard === hasSilhouette) {
    return NextResponse.json({ error: "Choisis un seul contenu à liker" }, { status: 400 });
  }
  const targetId = hasMoodboard ? moodboardId : silhouetteId;
  if (
    !(typeof targetId === "number" && Number.isSafeInteger(targetId) && targetId > 0) &&
    !(typeof targetId === "string" && /^[1-9]\d*$/.test(targetId) && Number.isSafeInteger(Number(targetId)))
  ) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
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

    if (!moodboard.rows[0]) {
      return NextResponse.json({ error: "Moodboard introuvable" }, { status: 404 });
    }

    if (Number(moodboard.rows[0].user_id) === Number(user.id)) {
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

    if (!silhouette.rows[0]) {
      return NextResponse.json({ error: "Look introuvable" }, { status: 404 });
    }

    if (Number(silhouette.rows[0].user_id) === Number(user.id)) {
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
  let body: { moodboardId?: unknown; silhouetteId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { moodboardId, silhouetteId } = body;

  const hasMoodboard = moodboardId !== undefined && moodboardId !== null;
  const hasSilhouette = silhouetteId !== undefined && silhouetteId !== null;
  if (hasMoodboard === hasSilhouette) {
    return NextResponse.json({ error: "Choisis un seul contenu à liker" }, { status: 400 });
  }
  const targetId = hasMoodboard ? moodboardId : silhouetteId;
  if (
    !(typeof targetId === "number" && Number.isSafeInteger(targetId) && targetId > 0) &&
    !(typeof targetId === "string" && /^[1-9]\d*$/.test(targetId) && Number.isSafeInteger(Number(targetId)))
  ) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
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
          AND moodboard_id IS NOT DISTINCT FROM $2
          AND silhouette_id IS NOT DISTINCT FROM $3
        RETURNING *
      `,
      [user.id, moodboardId ?? null, silhouetteId ?? null],
    );

    return NextResponse.json({ success: true, removed: (result.rowCount ?? 0) > 0 });
  } catch (err: any) {
    if (err.code === "23505") {
      return NextResponse.json({ error: "DEJA LIKE" }, { status: 409 });
    }

    console.error(err);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
