export async function getUserMoodboards(userId?: number, from?:string){

  let url = "/api/moodboards"

  if(from === "references"){
    url += "?liked=true"
  }
  else if(userId){
    url += `?userId=${userId}`
  }

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("Erreur récupération moodboards utilisateur")
  }

  return res.json()
}