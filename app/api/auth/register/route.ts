import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { pool } from '@/lib/db'


//QUERY : envoyer une question a la base
//pool.query " execute une requete sql sur la bdd"
//json langage universel de donnees 
//“le cookie transporte le token, et le token permet de retrouver la session en base”
//request: requete hhtp envoyee par le nav(via fetch)
//async : cette fonction va contenir du code qui prend du temps

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const SALT_ROUNDS = 10

export async function POST(request: Request){
    const body = await request.json()
    const {username, email, password} = body

    /* VALIDATION DU FORMAT */
    if (!username || !email || !password){
        return NextResponse.json(
            {error: 'Champs manquants'},
            {status: 400}
        )
    }

    if (!EMAIL_REGEX.test(email)){
        return NextResponse.json(
            {error: 'Email invalide'},
            {status: 400}
        )
    }

    if (password.length < MIN_PASSWORD_LENGTH){
        return NextResponse.json(
            {error: 'Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH}'},
            {status: 400}
        )
    }

    /* HASHAGE */
    const pswHash = await bcrypt.hash(password, SALT_ROUNDS)

    /* INSERTION */

    try{
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at`,
            [username, email, pswHash]
        )
        return NextResponse.json(result.rows[0], {status:201})
    } catch (err: any){
        // code 23505 = violation de contrainte UNIQUE (Postgres)
        if (err.code === '23505'){
            return NextResponse.json(
                {error: 'Pseudo/mail deja utilise'},
                {status: 409}
            )
        }
        console.error(err)
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        )
    }
}
