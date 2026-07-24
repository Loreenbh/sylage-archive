import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    
    /* RECUPERATION DE LA SESSION */
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    const session = await pool.query(
        `SELECT user_id
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

    const userId = userIdParam
        ? Number(userIdParam)
        : currentSession.user_id


    const user = await pool.query(
        `
        SELECT id, username, avatar_url
        FROM users
        WHERE id=$1
        `,
        [userId]
    )

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

        WHERE moodboards.user_id = $1

        GROUP BY moodboards.id, users.username

        ORDER BY moodboards.created_at DESC
        `,
        [
        userId,
        currentSession.user_id
        ]
    )

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

        GROUP BY silhouettes.id, users.username

        ORDER BY silhouettes.created_at DESC
        `,
        [
        userId,
        currentSession.user_id
        ]
    )

    return NextResponse.json({
        user: user.rows[0],
        moodboards: moodboards.rows,
        silhouettes: silhouettes.rows
        })
}