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
  moodboardId?: number,
  from?:string
){

  let url = "/api/silhouettes"

  if (from === "references") {
    console.log("1")
    url += "?liked=true"
  }
  else if (moodboardId) {
        console.log("2")
    url += `?moodboardId=${moodboardId}`
  }
  else if (userId) {
        console.log("3")
    url += `?userId=${userId}`
  }

  console.log("SILHOUETTES URL :", url)
  const res = await fetch(url)

  if(!res.ok){
    throw new Error("Erreur récupération silhouettes")
  }
  return res.json()
}