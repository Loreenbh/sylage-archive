import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('user')
    
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

    let userToShow
    if (!username){
        userToShow = {
            id: currentSession.user_id
        }
        const moodboards = await pool.query(
            `
            SELECT *
            FROM moodboards
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userToShow.id]
        )

        const silhouettes = await pool.query(
        `
            SELECT *
            FROM silhouettes
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userToShow.id]
        )
        return NextResponse.json({
            moodboards: moodboards.rows,
            silhouettes: silhouettes.rows
            })
    }
    else{
        const requestedUser =  await pool.query(
        `
            SELECT id
            FROM users
            WHERE username = $1
            `,
            [username]
        )
        const userToShow = requestedUser.rows[0]
        const moodboards = await pool.query(
            `
            SELECT *
            FROM moodboards
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userToShow.id]
        )

        const silhouettes = await pool.query(
        `
            SELECT *
            FROM silhouettes
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userToShow.id]
        )
        return NextResponse.json({
            moodboards: moodboards.rows,
            silhouettes: silhouettes.rows
            })
    }

}