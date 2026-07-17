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