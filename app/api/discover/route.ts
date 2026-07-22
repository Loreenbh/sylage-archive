import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
    /* RECUPERATION DE LA SESSION */
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if (!token) {
    return NextResponse.json(
        { error: "Non connecté" },
        { status: 401 }
    )
    }

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
            { error: "Session invalide" },
            { status: 401 }
        )
    }
    const res =  await pool.query(
        `SELECT moodboards.*, 
        users.username, 

        EXISTS (
            SELECT 1
            FROM follows
            WHERE follows.follower_id = $1
            AND follows.following_id = users.id
        ) AS is_followed,

        COUNT(DISTINCT likes.id)::int AS "likes_count",
        COUNT(DISTINCT silhouettes.id)::int AS "silhouettes_count",

        EXISTS (
            SELECT FROM likes 
            WHERE likes.user_id = $1 
            AND likes.moodboard_id = moodboards.id) 
            AS liked_by_current_user
        FROM moodboards
        JOIN users
        ON users.id = moodboards.user_id
        LEFT JOIN likes
        ON likes.moodboard_id = moodboards.id
        LEFT JOIN silhouettes
        ON silhouettes.moodboard_id = moodboards.id
        WHERE moodboards.user_id != $1
        GROUP BY moodboards.id, users.id, users.username
        ORDER BY moodboards.created_at DESC
        `,
        [currentSession.user_id]
    )
    return NextResponse.json(res.rows)
}