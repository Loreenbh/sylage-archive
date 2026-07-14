import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function POST(request: Request){

    const body = await request.json()
    const { imageUrl, moodboardId } = body


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

    if (!imageUrl || !moodboardId){
        return NextResponse.json(
            {error:'Champs manquants'},
            {status: 400}
        )
    }

    try{
        const result = await pool.query(
            `
            INSERT INTO silhouettes
            (user_id, moodboard_id, image_url)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                user.user_id,
                moodboardId,
                imageUrl
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

export async function GET(request: Request){

    const { searchParams } = new URL(request.url)

    const username = searchParams.get("user")
    const tag = searchParams.get("tag")


    if (!username){
        return NextResponse.json(
            {error:"Utilisateur manquant"},
            {status:400}
        )
    }


    let query = `
        SELECT silhouettes.*, users.username, moodboards.tags
        FROM silhouettes
        JOIN users
        ON users.id = silhouettes.user_id
        JOIN moodboards
        ON moodboards.id = silhouettes.moodboard_id
        WHERE users.username = $1
    `


    const values = [username]


    if(tag){
        query += `
        AND $2 = ANY(moodboards.tags)
        `
        values.push(tag)
    }


    query += `
        ORDER BY silhouettes.created_at DESC
    `


    const result = await pool.query(
        query,
        values
    )


    return NextResponse.json(result.rows)
}