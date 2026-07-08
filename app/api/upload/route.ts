import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(request: Request) {
  const body = await request.json()
  const { imageData } = body // data URL: "data:image/png;base64,...."

  if (!imageData) {
    return NextResponse.json({ error: 'Image manquante' }, { status: 400 })
  }

  const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/)

  if (!matches) {
    return NextResponse.json({ error: "Format d'image invalide" }, { status: 400 })
  }

  const extension = matches[1]
  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')

  const filename = `${crypto.randomUUID()}.${extension}`
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadsDir, { recursive: true })
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 })
}