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

export async function getDiscoverMoodboards(sort: "latest" | "curated" | "following"){

    const res = await fetch(`/api/discover?sort=${sort}`)
    if (!res.ok) {
        throw new Error("Erreur récupération moodboards")
    }
    const data = await res.json()
    return data
}