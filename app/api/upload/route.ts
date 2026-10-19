import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { getCurrentSessionUser } from "@/lib/services/session";

export async function POST(request: Request) {
  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const MAX_REQUEST_SIZE = 3 * 1024 * 1024;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_SIZE) {
    return NextResponse.json({ error: "Image trop volumineuse (max 2 Mo)" }, { status: 413 });
  }

  let body: { imageData?: unknown };
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_SIZE) {
      return NextResponse.json({ error: "Image trop volumineuse (max 2 Mo)" }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const imageData = body.imageData;

  if (typeof imageData !== "string" || !imageData) {
    return NextResponse.json({ error: "Image manquante" }, { status: 400 });
  }

  const matches = imageData.match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/]+={0,2})$/i);

  if (!matches) {
    return NextResponse.json(
      { error: "Format d'image invalide" },
      { status: 400 },
    );
  }

  const extension = matches[1].toLowerCase();

  const allowedExtensions = ["png", "jpeg", "jpg", "webp"];

  if (!allowedExtensions.includes(extension)) {
    return NextResponse.json(
      {
        error: "Format d'image non supporté",
      },
      {
        status: 400,
      },
    );
  }

  const base64Data = matches[2];
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  if (base64Data.length > Math.ceil(MAX_FILE_SIZE / 3) * 4 + 4) {
    return NextResponse.json({ error: "Image trop volumineuse (max 2 Mo)" }, { status: 413 });
  }

  const buffer = Buffer.from(base64Data, "base64");

  if (buffer.length === 0) {
    return NextResponse.json({ error: "Image vide ou invalide" }, { status: 400 });
  }

  if (buffer.length > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image trop volumineuse ou vide (max 2 Mo)" }, { status: 413 });
  }

  const isPng = buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isWebp = buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  if (!(extension === "png" ? isPng : extension === "jpg" || extension === "jpeg" ? isJpeg : isWebp)) {
    return NextResponse.json({ error: "Le fichier ne semble pas être une image valide" }, { status: 400 });
  }

  const filename = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filename, buffer, {
      contentType: extension === "jpg" || extension === "jpeg" ? "image/jpeg" : `image/${extension}`,
      upsert: false,
    });

  if (error) {
    console.error("Erreur upload Supabase :", error);

    return NextResponse.json(
      {
        error: "Erreur upload image",
      },
      {
        status: 500,
      },
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(filename);

  return NextResponse.json(
    {
      url: publicUrl,
    },
    {
      status: 201,
    },
  );
}
