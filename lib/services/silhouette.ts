export async function createSilhouette(
  imageUrl: string,
  moodboardId: number
) {
  const res = await fetch("/api/silhouettes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageUrl,
      moodboardId
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? "Erreur création silhouette")
  }

  return data
}


export async function getSilhouetteData(username?: string){
    const url = username
    ? `/api/silhouettes?user=${username}`
    : `/api/silhouettes`

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error("Erreur récupération silhouettes")
    }

    return res.json()
}