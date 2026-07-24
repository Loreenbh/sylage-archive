import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { pool } from "@/lib/db"


export async function PATCH(request: Request) {

  const { avatar_url } = await request.json()
  console.log("BODY AVATAR :", avatar_url)

  if (!avatar_url) {
    return NextResponse.json(
      { error: "Avatar manquant" },
      { status:400 }
    )
  }


  const cookieStore = await cookies()

  const token = cookieStore
    .get("session_token")
    ?.value


  const session = await pool.query(
    `
    SELECT user_id
    FROM sessions
    WHERE token=$1
    AND expires_at > NOW()
    `,
    [token]
  )


  const currentSession = session.rows[0]


  if (!currentSession) {
    return NextResponse.json(
      { error:"Non connecté" },
      { status:401 }
    )
  }


  const user = await pool.query(
    `
    UPDATE users
    SET avatar_url=$1
    WHERE id=$2
    RETURNING id, username, avatar_url
    `,
    [
      avatar_url,
      currentSession.user_id
    ]
  )

console.log("USER UPDATE RESULT :", user.rows[0])
  return NextResponse.json({
    user:user.rows[0]
  })
}