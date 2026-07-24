export async function getProfileData(username?: string){
    const url = username
    ? `/api/profile?user=${username}`
    : `/api/profile`

    const res = await fetch(url)
    if (!res.ok) {
        throw new Error("Erreur récupération profil")
    }

    return res.json()
}


export async function updateAvatar(avatar_url: string) {

  const res = await fetch("/api/users/avatar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      avatar_url
    })
  })
  console.log("RETOUR API /AVATAR:", res)

  if (!res.ok) {
    throw new Error("Erreur mise à jour avatar")
  }


  return res.json()
}