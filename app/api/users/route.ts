import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcrypt"
import { pool } from "@/lib/db"
import { getCurrentSessionUser } from "@/lib/services/session"


const MIN_USERNAME_LENGTH = 3
const MAX_USERNAME_LENGTH = 15

const MIN_PASSWORD_LENGTH = 4
const MAX_PASSWORD_LENGTH = 20


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get("userId")
    // /* SESSION */
    // const cookieStore = await cookies()

    // const token = cookieStore
    //     .get("session_token")
    //     ?.value


    // const session = await pool.query(
    //     `
    //     SELECT user_id
    //     FROM sessions
    //     WHERE token=$1
    //     AND expires_at > NOW()
    //     `,
    //     [token]
    // )
    const currentSession = await getCurrentSessionUser()
    if (!currentSession) {
        return NextResponse.json(
            { error:"Non connecté" },
            { status:401 }
        )
    }

    const userId = userIdParam
        ? Number(userIdParam)
        : currentSession.user_id


    const user = await pool.query(
        `
        SELECT id, username, avatar_url
        FROM users
        WHERE id=$1
        `,
        [userId]
    )

    if (!user.rows[0]) {
        return NextResponse.json(
            { error:"Utilisateur introuvable" },
            { status:404 }
        )
    }


    const moodboards = await pool.query(
        `
        SELECT 
            moodboards.*,
            users.username,
            COUNT(DISTINCT likes.id)::int AS likes_count,
            COUNT(DISTINCT silhouettes.id)::int AS silhouettes_count,

            EXISTS (
                SELECT 1
                FROM likes
                WHERE likes.moodboard_id = moodboards.id
                AND likes.user_id = $2
            ) AS liked_by_current_user

        FROM moodboards

        JOIN users
        ON users.id = moodboards.user_id

        LEFT JOIN likes
        ON likes.moodboard_id = moodboards.id

        LEFT JOIN silhouettes
        ON silhouettes.moodboard_id = moodboards.id

        WHERE moodboards.user_id=$1

        GROUP BY 
            moodboards.id,
            users.username

        ORDER BY moodboards.created_at DESC
        `,
        [
            userId,
            currentSession.user_id
        ]
    )


    const silhouettes = await pool.query(
        `
        SELECT
            silhouettes.*,
            users.username,

            COUNT(likes.id)::int AS likes_count,

            EXISTS (
                SELECT 1
                FROM likes
                WHERE likes.silhouette_id = silhouettes.id
                AND likes.user_id = $2
            ) AS liked_by_current_user

        FROM silhouettes

        JOIN users
        ON users.id = silhouettes.user_id

        LEFT JOIN likes
        ON likes.silhouette_id = silhouettes.id

        WHERE silhouettes.user_id=$1

        GROUP BY
            silhouettes.id,
            users.username

        ORDER BY silhouettes.created_at DESC
        `,
        [
            userId,
            currentSession.user_id
        ]
    )
    return NextResponse.json({
        user:user.rows[0],
        moodboards:moodboards.rows,
        silhouettes:silhouettes.rows
    })

}


export async function PATCH(request: Request) {
    const {
        avatar_url,
        username,
        password,
        oldPassword
    } = await request.json()



    // /* SESSION */

    // const cookieStore = await cookies()

    // const token = cookieStore
    //     .get("session_token")
    //     ?.value



    // const session = await pool.query(
    //     `
    //     SELECT user_id
    //     FROM sessions
    //     WHERE token=$1
    //     AND expires_at > NOW()
    //     `,
    //     [token]
    // )


    const currentSession = await getCurrentSessionUser()
    if (!currentSession) {
        return NextResponse.json(
            { error:"Non connecté" },
            { status:401 }
        )
    }


    let updatedUser = null

    /*USERNAME*/
    if (username) {
        if (username.length < 3) {
            return NextResponse.json(
                { error:`Username must be at least ${MIN_USERNAME_LENGTH} characters`},
                { status:400 }
            )
        }

        if (username.length > MAX_USERNAME_LENGTH) {
            return NextResponse.json(
                { error:`Username must be less than ${MAX_USERNAME_LENGTH} characters`},
                { status:400 }
            )
        }

        const existing = await pool.query(
            `
            SELECT id
            FROM users
            WHERE username=$1
            AND id != $2
            `,
            [ username, currentSession.user_id ]
        )

        if(existing.rows[0]) {
            return NextResponse.json(
                { error:"Username already taken"},
                {status:409}
            )
        }
    }


    /*AVATAR / USERNAME UPDATE*/
    if (avatar_url || username) {
        updatedUser = await pool.query(
            `
            UPDATE users

            SET
                avatar_url = COALESCE($1, avatar_url),
                username = COALESCE($2, username)

            WHERE id=$3

            RETURNING id, username, avatar_url
            `,
            [
                avatar_url ?? null,
                username ?? null,
                currentSession.user_id
            ]
        )
    }

    /*PASSWORD UPDATE*/
    if (password) {
        if (!oldPassword) {
            return NextResponse.json(
                {error:"Ancien mot de passe manquant"},
                {status:400}
            )
        }

        const result = await pool.query(
            `
            SELECT password_hash
            FROM users
            WHERE id=$1
            `,
            [currentSession.user_id]
        )

        const valid = await bcrypt.compare(
            oldPassword,
            result.rows[0].password_hash
        )

        if (!valid) {
            return NextResponse.json(
                {error:"Ancien mot de passe incorrect"},
                {status:400}
            )
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json(
                {error:`Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères`},
                {status:400}
            )
        }


        const newHash = await bcrypt.hash(password,10)
            await pool.query(
                `
                UPDATE users
                SET password_hash=$1
                WHERE id=$2
                `,
                [
                    newHash,
                    currentSession.user_id
                ]
            )
    }

    if (updatedUser) {
        return NextResponse.json({
            user:updatedUser.rows[0]
        })
    }


    const user = await pool.query(
        `
        SELECT id, username, avatar_url
        FROM users
        WHERE id=$1
        `,
        [currentSession.user_id]
    )
    return NextResponse.json({
        user:user.rows[0]
    })
}


export async function DELETE(){

//   const cookieStore = await cookies()

//   const token = cookieStore
//     .get("session_token")
//     ?.value



//   const session = await pool.query(
//     `
//     SELECT user_id
//     FROM sessions
//     WHERE token=$1
//     AND expires_at > NOW()
//     `,
//     [token]
//   )
  const currentSession = await getCurrentSessionUser()
  if(!currentSession){
    return NextResponse.json(
      {error:"Non connecté"},
      {status:401}
    )
  }
  await pool.query(
    `
    DELETE FROM users
    WHERE id=$1
    `,
    [currentSession.user_id]
  )
  return NextResponse.json({
    success:true
  })
}