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

//soit mes mood a moi= profile, tous les mood des autres = feed, tous les moood d un user
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
console.log("URL COMPLETE :", request.url)
    const username = searchParams.get('user')
  console.log("PARAM USER :", searchParams.get("user"))


  const cookieStore = await cookies()
const token = cookieStore.get("session_token")?.value


    const baseQuery =
        `SELECT moodboards.*, users.username
        FROM moodboards
        JOIN users
        ON users.id = moodboards.user_id
    
        `
    const session = await pool.query(
        `SELECT user_id
        FROM sessions
        WHERE token=$1
        AND expires_at > NOW()
        `,
        [token]
    )

    const currentUser = session.rows[0]

    //username envoye dans l urldonc
    // const res = username
    // ? await pool.query(
    //     `${baseQuery} WHERE users.username = $1
    //     ORDER BY moodboards.created_at DESC`,
    //     [username]
    // )
    // : await pool.query(`${currentUser.id} != moodboards.user_id ORDER BY moodboards.created_at DESC`)
    const  requestedUsername = username // soit moi soit alice
    if (!res) //personne
    else if (res != currentUser.username) //ici alice

    else //moi

    return NextResponse.json(res.rows)
}

//ma session a un user_id qui est lie a users.id dpmc currentUser