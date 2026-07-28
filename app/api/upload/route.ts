import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {

  const { imageData } = await request.json()

  if (!imageData) {
    return NextResponse.json(
      { error: "Image manquante" },
      { status: 400 }
    )
  }


  const matches = imageData.match(
    /^data:image\/(\w+);base64,(.+)$/
  )


  if (!matches) {
    return NextResponse.json(
      { error: "Format d'image invalide" },
      { status: 400 }
    )
  }


  const extension = matches[1]

  const allowedExtensions = [
    "png",
    "jpeg",
    "jpg",
    "webp"
  ]

  if (!allowedExtensions.includes(extension)) {
    return NextResponse.json(
      {
        error:"Format d'image non supporté"
      },
      {
        status:400
      }
    )
  }

  const base64Data = matches[2]


  const buffer = Buffer.from(
    base64Data,
    "base64"
  )

  const MAX_FILE_SIZE = 2 * 1024 * 1024

if (buffer.length > MAX_FILE_SIZE) {
  return NextResponse.json(
    {
      error: "Image trop volumineuse (max 2 Mo)"
    },
    {
      status: 400
    }
  )
}

  const filename = `${crypto.randomUUID()}.${extension}`


  const { error } = await supabase
    .storage
    .from("uploads")
    .upload(
      filename,
      buffer,
      {
        contentType: `image/${extension}`
      }
    )


  if (error) {

    console.error(
      "Erreur upload Supabase :",
      error
    )

    return NextResponse.json(
      {
        error: "Erreur upload image"
      },
      {
        status:500
      }
    )
  }



  const {
    data: {
      publicUrl
    }
  } = supabase
    .storage
    .from("uploads")
    .getPublicUrl(filename)



  return NextResponse.json(
    {
      url: publicUrl
    },
    {
      status:201
    }
  )

}