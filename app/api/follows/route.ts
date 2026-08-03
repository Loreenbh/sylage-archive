import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { getCurrentSessionUser } from "@/lib/services/session";


export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)

  const userIdParam = searchParams.get("userId")


  // SESSION
  // const cookieStore = await cookies()
  // const token = cookieStore.get("session_token")?.value


  // const session = await pool.query(
  //   `
  //   SELECT user_id
  //   FROM sessions
  //   WHERE token=$1
  //   AND expires_at > NOW()
  //   `,
  //   [token]
  // )


  const currentSession = await getCurrentSessionUser()


  if (!currentSession) {
    return NextResponse.json(
      { error: "Non connecté" },
      { status: 401 }
    )
  }


  // PROFIL CONSULTÉ OU PROFIL ACTUEL
  const userId = userIdParam
    ? Number(userIdParam)
    : currentSession.user_id



  // USER
  const user = await pool.query(
    `
    SELECT id, username
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



  // PERSONNES QUE L'UTILISATEUR SUIT
  const following = await pool.query(
    `
    SELECT 
      users.id,
      users.username,
      users.avatar_url,

      EXISTS (
        SELECT 1
        FROM follows f2
        WHERE f2.follower_id = $2
        AND f2.following_id = users.id
      ) AS is_followed

    FROM follows

    JOIN users
    ON users.id = follows.following_id

    WHERE follows.follower_id = $1

    ORDER BY follows.created_at DESC
    `,
    [
      userId,
      currentSession.user_id
    ]
  )



  // PERSONNES QUI SUIVENT L'UTILISATEUR
  const followers = await pool.query(
    `
    SELECT 
      users.id,
      users.username,
      users.avatar_url,

      EXISTS (
        SELECT 1
        FROM follows f2
        WHERE f2.follower_id = $2
        AND f2.following_id = users.id
      ) AS is_followed

    FROM follows

    JOIN users
    ON users.id = follows.follower_id

    WHERE follows.following_id = $1

    ORDER BY follows.created_at DESC
    `,
    [
      userId,
      currentSession.user_id
    ]
  )



  return NextResponse.json({
    user: user.rows[0],
    following: following.rows,
    followers: followers.rows
  })
}


// FOLLOW
export async function POST(request: Request) {
  const body = await request.json()
  const { userId } = body


  // const cookieStore = await cookies()
  // const token = cookieStore.get("session_token")?.value


  // const session = await pool.query(
  //   `
  //   SELECT user_id
  //   FROM sessions
  //   WHERE token=$1
  //   AND expires_at > NOW()
  //   `,
  //   [token]
  // )


  // const currentUser = session.rows[0]
  const currentUser = await getCurrentSessionUser()

  if(!currentUser){
    return NextResponse.json(
      {error:"Non connecté"},
      {status:401}
    )
  }


  if(!userId){
    return NextResponse.json(
      {error:"Utilisateur manquant"},
      {status:400}
    )
  }


  await pool.query(
    `
    INSERT INTO follows
    (
      follower_id,
      following_id
    )
    VALUES($1,$2)
    ON CONFLICT DO NOTHING
    `,
    [
      currentUser.user_id,
      userId
    ]
  )


  return NextResponse.json({
    success:true
  })

}



// UNFOLLOW
export async function DELETE(request: Request) {

  const { searchParams } = new URL(request.url)

  const userId = searchParams.get("userId")


  // const cookieStore = await cookies()
  // const token = cookieStore.get("session_token")?.value


  // const session = await pool.query(
  //   `
  //   SELECT user_id
  //   FROM sessions
  //   WHERE token=$1
  //   AND expires_at > NOW()
  //   `,
  //   [token]
  // )


  const currentUser = await getCurrentSessionUser()
  if(!currentUser){
    return NextResponse.json(
      {error:"Non connecté"},
      {status:401}
    )
  }

  await pool.query(
    `
    DELETE FROM follows
    WHERE follower_id=$1
    AND following_id=$2
    `,
    [
      currentUser.user_id,
      userId
    ]
  )
  return NextResponse.json({
    success:true
  })

}

