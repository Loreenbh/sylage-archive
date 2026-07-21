/*/api/users/[username]/moodboards
    GET     → moodboards d'un profil*/

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
        SELECT id, username
        FROM users
        WHERE id=$1
        `,
        [userId]
    )

    const moodboards = await pool.query(
        `
        SELECT *
        FROM moodboards
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    )

    const silhouettes = await pool.query(
    `
        SELECT *
        FROM silhouettes
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    )

    return NextResponse.json({
        user: user.rows[0],
        moodboards: moodboards.rows,
        silhouettes: silhouettes.rows
        })
}
   