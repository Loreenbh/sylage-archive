//Est ce que l user est connecte, si oui c est qui ?

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { pool } from '@/lib/db'

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value

    if (!token)
        return NextResponse.json({user: null})


    const result = pool.query(
        `SELECT 
            users.id, 
            users.email, 
            users.username,
            users.avatar_url
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token= $1 AND sessions.expires_at > NOW()`,
        [token]
    )

    const user = (await result).rows[0]

    if (!user){
        return NextResponse.json({user: null})
    }
    return NextResponse.json({user})
}