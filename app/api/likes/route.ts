import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

export async function POST(request: Request){
    const body = await request.json()
    const { moodboardId } = body

    if (!moodboardId){
        return NextResponse.json(
            {error:"Moodboard is missing"},
            {status:400}
        )
    }

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


    try{
        const result = await pool.query(
            `
            INSERT INTO likes
            (user_id, moodboard_id)
            VALUES ($1, $2)
            RETURNING *
            `,
            [
                user.user_id,
                moodboardId,
            ]
        )

    return NextResponse.json(
        result.rows[0],
        {status:201}
    )}catch (err:any) {
        if (err.code === '23505'){
            return NextResponse.json(
                {error: 'DEJA LIKE'},
                {status: 409}
            )
        }
        console.error(err)
        return NextResponse.json(
            {error: 'Erreur serveur'},
            {status: 500}
        )
    }
}

export async function DELETE(request: Request) {
    const body = await request.json()
    const { moodboardId } = body

    if (!moodboardId){
        return NextResponse.json(
            {error:"Moodboard is missing"},
            {status:400}
        )
    }

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


    try{
        const result = await pool.query(
            `
            DELETE FROM likes
            WHERE moodboard_id = $1 
            AND user_id = $2
            RETURNING *
            `,
            [
                moodboardId,
                user.user_id,
            ]
        )

    return NextResponse.json(
        result.rows[0],
        {status:201}
    )}catch (err:any) {
        if (err.code === '23505'){
            return NextResponse.json(
                {error: 'DEJA LIKE'},
                {status: 409}
            )
        }
        console.error(err)
        return NextResponse.json(
            {error: 'Erreur serveur'},
            {status: 500}
        )
    }
}