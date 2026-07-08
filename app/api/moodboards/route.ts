import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function POST(request: Request){
    const body = await request.json()
    const { imageUrl, tags } = body


    /* AUTHENTIFICATION */
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if (!token){
        return NextResponse.json(
            {error:"Non connecte"},
            {status:401}
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

    const user = session.rows[0]

    if (!user){
        return NextResponse.json(
            {error:"Session invalide"},
            {status:401}
        )
    }


    /* VALIDATION */

    if (!imageUrl || !tags){
        return NextResponse.json(
            {error:'Champs manquants'},
            {status: 400}
        )
    }

    try{
        const result = await pool.query(
            `
            INSERT INTO moodboards
            (user_id, image_url, tags)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                user.user_id,
                imageUrl,
                tags
            ]
        )

    return NextResponse.json(
        result.rows[0],
        {status:201}
    )}catch (err:any) {
        if (err.code === '23514'){
            return NextResponse.json(
                {error: 'Il faut entre 3 et 5 tags'},
                {status: 400}
            )
        }
        console.error(err)
        return NextResponse.json(
            {error: 'Erreur serveur'},
            {status: 500}
        )
    }
}


export async function GET() {
    const res = await pool.query(
        `SELECT moodboards.*, users.username
        FROM moodboards
        JOIN users
        ON moodboards.user_id = users.id
        ORDER BY created_at DESC`
    )
    return NextResponse.json(res.rows)
}