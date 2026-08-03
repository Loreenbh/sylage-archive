import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { pool } from '@/lib/db'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 35


const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 15

const SALT_ROUNDS = 10

export async function POST(request: Request){
    const body = await request.json()
    const {username, email, password} = body

    if (!username || !email || !password){
        return NextResponse.json(
            {error: 'test'},
            {status: 400}
        )
    }

    /* NETTOYAGE */
    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    /* VALIDATION USERNAME */
    if (
        cleanUsername.length < MIN_USERNAME_LENGTH ||
        cleanUsername.length > MAX_USERNAME_LENGTH
    ){
        return NextResponse.json(
            {error: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters long`},
            { status: 400}
        )
    }

    if (!USERNAME_REGEX.test(cleanUsername)){
        return NextResponse.json(
            {error: "Username can only contain letters, numbers and underscores"},
            {status: 400}
        )
    }


    /* VALIDATION EMAIL */
    if (!EMAIL_REGEX.test(cleanEmail)){
        return NextResponse.json(
            {error: "Invalid email address"},
            {status: 400}
        )
    }

    /* VALIDATION PASSWORD */
    if (password.length < MIN_PASSWORD_LENGTH){
        return NextResponse.json(
            {error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`},
            {status: 400}
        )
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
    return NextResponse.json(
        {error: "Password is too long"},
        {status: 400}
    )
    }

    if (!PASSWORD_REGEX.test(password)){
        return NextResponse.json(
            {error:"Password must contain at least a letter, a number, and a special character"},
            {status:400}
        )
    }

    
    /* HASHAGE */
    const pswHash = await bcrypt.hash(password, SALT_ROUNDS)
    /* INSERTION */
    try{
        const result = await pool.query(
            `
            INSERT INTO users (
                username,
                email,
                password_hash
            )
            VALUES ($1,$2,$3)
            RETURNING id, username, email, created_at
            `,
            [
                cleanUsername,
                cleanEmail,
                pswHash
            ]
        )

        return NextResponse.json(
            result.rows[0],
            {status:201}
        )

    } catch(err: any){
        if(err.code === "23505"){
            return NextResponse.json(
                {error:"Username or email is already in use"},
                {status:409}
            )
        }
        console.error(err)
        return NextResponse.json(
            {error:"Internal server error"},
            {status:500}
        )
    }
}