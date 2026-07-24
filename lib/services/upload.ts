export async function uploadImage(imageData: string) {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageData }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? "Erreur upload")
  }

  return data.url
}


/*
PATCH /api/users/avatar
UPDATE users
SET avatar_url = $1
WHERE id = $2

EDIT PROFILE
      |
      |
      v
/api/upload
      |
      | retourne url
      v
/api/users/avatar
      |
      | UPDATE users.avatar_url
      v
BDD users


*/