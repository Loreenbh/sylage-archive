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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    console.log("URL COMPLETE :", request.url)
    const username = searchParams.get('user')
    console.log("PARAM USER :", searchParams.get("user"))

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

    if (!username){ //tous les mood sauf le mien
        console.log("1")
        const res =  await pool.query(
            `SELECT moodboards.*, users.username, COUNT(likes.id) AS likes_count
            FROM moodboards
            JOIN users
            ON users.id = moodboards.user_id
            LEFT JOIN likes
            ON likes.moodboard_id = moodboards.id
            WHERE moodboards.user_id != $1
            GROUP BY moodboards.id, users.username
            ORDER BY moodboards.created_at DESC
            `,
            [currentSession.user_id]
        )
        return NextResponse.json(res.rows)
    }
    else{
        //personne demandee: moi ou x?
        console.log("2")
        const requestedUser =  await pool.query( //pas moi
            `
            SELECT id
            FROM users
            WHERE username = $1
            `,
            [username]
        )
        const userToShow = requestedUser.rows[0]

        if (userToShow.id === currentSession.user_id){
            // MON PROFIL
            console.log("3")
            const res = await pool.query( //moi
                `SELECT moodboards.*, users.username
                FROM moodboards
                JOIN users
                ON users.id = moodboards.user_id
                WHERE moodboards.user_id = $1
                ORDER BY moodboards.created_at DESC
                `,
                [userToShow.id]
            )
            return NextResponse.json(res.rows)
        }
        else{
            // PROFIL AUTRE PERSONNE
            console.log("4")
            const res = await pool.query( //pasmoi
                `SELECT moodboards.*, users.username
                FROM moodboards
                JOIN users
                ON users.id = moodboards.user_id
                WHERE moodboards.user_id = $1
                ORDER BY moodboards.created_at DESC
                `,
                [userToShow.id]
            )
            return NextResponse.json(res.rows)
        }
    }
}

