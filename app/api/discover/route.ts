import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") ?? "latest"

    const currentSession = await getCurrentSessionUser()
    if (!currentSession) {
        return NextResponse.json(
            { error: "Session invalide" },
            { status: 401 }
        )
    }

    let orderBy = `
        ORDER BY moodboards.created_at DESC
    `
    if (sort === "curated") {
        orderBy = `
        ORDER BY (
            COUNT(DISTINCT likes.id) * 2
            +
            COUNT(DISTINCT silhouettes.id)
        ) DESC
        `
    }


    /* FILTRE */
    let whereCondition = `
        WHERE moodboards.user_id != $1
    `
    if (sort === "following") {

        whereCondition = `
        WHERE moodboards.user_id IN (
            SELECT following_id
            FROM follows
            WHERE follower_id = $1
        )
        `
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
        ${whereCondition}
        GROUP BY moodboards.id, users.id, users.username
        ${orderBy}
        `,
        [currentSession.id]
    )
    return NextResponse.json(res.rows)
}