import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { pool } from '@/lib/db'

//
export async function POST(){
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value

    if (token){
        await pool.query(
            `DELETE FROM sessions
            WHERE token = $1`,
            [token]
        )
    }

    const response = NextResponse.json({success: true})
    response.cookies.delete('session_token')

    return response
}