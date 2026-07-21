export async function getUserMoodboards(userId:number){

  const res = await fetch(
    `/api/moodboards?userId=${userId}`
  )

  if (!res.ok) {
    throw new Error("Erreur récupération moodboards utilisateur")
  }

  return res.json()
}