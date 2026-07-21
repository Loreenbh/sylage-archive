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


export async function getSilhouetteData(
  userId?: number,
  moodboardId?: number
){

  let url = "/api/silhouettes"

  if(moodboardId){
    url += `?moodboardId=${moodboardId}`
  }
  else if(userId){
    url += `?userId=${userId}`
  }


  const res = await fetch(url)

  if(!res.ok){
    throw new Error("Erreur récupération silhouettes")
  }

  return res.json()
}