import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function GET(request: Request) {
    const currentSession = await getCurrentSessionUser()

    if (!currentSession) {
        return NextResponse.json(
        {error:"Non connecté"},
        {status:401}
        )
    }

    const likedLooks = await pool.query(
    `
    SELECT 
        silhouettes.*,
        users.username,
        silhouettes.image_url
    FROM likes

    JOIN silhouettes
    ON silhouettes.id = likes.silhouette_id

    JOIN users
    ON users.id = silhouettes.user_id

    WHERE likes.user_id = $1

    ORDER BY likes.created_at DESC
    `,
    [currentSession.user_id]
    )

    const likedMoods = await pool.query(
    `
    SELECT 
        moodboards.*,
        users.username
    FROM likes

    JOIN moodboards
    ON moodboards.id = likes.moodboard_id

    JOIN users
    ON users.id = moodboards.user_id

    WHERE likes.user_id = $1

    ORDER BY likes.created_at DESC
    `,
    [currentSession.user_id]
    )

    const muse = await pool.query(
    `
    SELECT 
        users.id,
        users.username,
        users.avatar_url,
        COUNT(*)::int AS score

    FROM likes

    LEFT JOIN silhouettes
    ON silhouettes.id = likes.silhouette_id

    LEFT JOIN moodboards
    ON moodboards.id = likes.moodboard_id

    JOIN users
    ON users.id = COALESCE(
        silhouettes.user_id,
        moodboards.user_id
    )

    WHERE likes.user_id = $1

    GROUP BY users.id

    ORDER BY score DESC

    LIMIT 1
    `,
    [currentSession.user_id]
    )

    return NextResponse.json({
        looks: likedLooks.rows,
        moods: likedMoods.rows,
        muse: muse.rows[0] ?? null
    })

}