import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { pool } from '@/lib/db'

const SESSION_DURATION_DAYS = 7

export async function POST (request: Request){
    const body = await request.json()
    const {identifier, password } = body
    
    if (!identifier || !password){
        return NextResponse.json(
            { error: "Missing required fields" }, 
            { status: 400 }
        )
    }

    const cleanIdentifier = identifier.trim().toLowerCase()
    const userResult = await pool.query(
        `SELECT id, username, password_hash
        FROM users
        WHERE email = $1 OR username = $1`,
        [cleanIdentifier]
    )

    const user = userResult.rows[0]
    if (!user){
        return NextResponse.json(
            { error: "Invalid email/username or password" }, 
            { status: 401 }
        )
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches){
        return NextResponse.json(
            {error: "Invalid email/username or password"},
            {status: 401}
        )
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)
    await pool.query(
        'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
        [token, user.id, expiresAt]
    )
 
    const response = NextResponse.json({ id: user.id, username: user.username })
    response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    })
    return response
}