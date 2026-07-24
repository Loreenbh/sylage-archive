export async function getUserMoodboards(userId?: number){

  const url = userId
    ? `/api/moodboards?userId=${userId}`
    : `/api/moodboards`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Erreur récupération moodboards utilisateur")
  }

  return res.json()
}