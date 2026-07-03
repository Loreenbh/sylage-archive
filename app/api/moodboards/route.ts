import { NextResponse } from "next/server";
import { pool } from '@/lib/db'

export async function GET() {
    const result = await pool.query('SELECT * FROM moodboards ORDER BY created_at DESC')
    return NextResponse.json(result.rows)
}

export async function POST(request: Request){
    const body = await request.json()
    const { user_id, layout, tags, images } = body

    const result = await pool.query(
        `INSERT INTO moodboards (user_id, layout, tags, images)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [user_id, layout, tags, JSON.stringify(images)]
    )
    return NextResponse.json(result.rows[0], { status: 200
    })
}