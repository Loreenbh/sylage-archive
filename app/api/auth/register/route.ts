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
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/

const MIN_PASSWORD_LENGTH = 8

const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 15

const SALT_ROUNDS = 10

export async function POST(request: Request){
    const body = await request.json()
    const {username, email, password} = body

    /* CHAMPS OBLIGATOIRES */
    if (!username || !email || !password){
        return NextResponse.json(
            {error: 'Champs manquants'},
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
            {
                error:
                `Le pseudo doit faire entre ${MIN_USERNAME_LENGTH} et ${MAX_USERNAME_LENGTH} caractères`
            },
            {status:400}
        )
    }


    if (!USERNAME_REGEX.test(cleanUsername)){
        return NextResponse.json(
            {
                error:
                "Le pseudo contient des caractères invalides"
            },
            {status:400}
        )
    }



    /* VALIDATION EMAIL */


    if (!EMAIL_REGEX.test(cleanEmail)){
        return NextResponse.json(
            {
                error:"Email invalide"
            },
            {status:400}
        )
    }



    /* VALIDATION PASSWORD */


    if (password.length < MIN_PASSWORD_LENGTH){
        return NextResponse.json(
            {
                error:
                `Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères`
            },
            {status:400}
        )
    }


    if (!PASSWORD_REGEX.test(password)){
        return NextResponse.json(
            {
                error:
                "Le mot de passe doit contenir une lettre, un chiffre et un caractère spécial"
            },
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


    } catch(err:any){

        if(err.code === "23505"){

            return NextResponse.json(
                {
                    error:"Pseudo ou email déjà utilisé"
                },
                {status:409}
            )

        }


        console.error(err)

        return NextResponse.json(
            {
                error:"Erreur serveur"
            },
            {status:500}
        )
    }
}