export async function createMoodboard(
  imageUrl: string,
  tags: string[]
) {
  const res = await fetch("/api/moodboards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageUrl,
      tags,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? "Erreur création moodboard")
  }

  return data
}


export async function getMoodboardData(username?: string){
    const url = username
    ? `/api/moodboards?user=${username}`
    : `/api/moodboards`

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error("Erreur récupération moodboard")
    }

    return res.json()
}