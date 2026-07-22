export async function getFollows(userId?: number){

  const url = userId
    ? `/api/follows?userId=${userId}`
    : `/api/follows`


  const res = await fetch(url)


  if(!res.ok){
    throw new Error("Erreur récupération abonnements")
  }


  return res.json()
}


export async function followUser(userId: number){

  const res = await fetch("/api/follows", {
    method: "POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      userId
    })
  })


  if(!res.ok){
    throw new Error("Erreur follow")
  }


  return res.json()
}



export async function unfollowUser(userId: number){

  const res = await fetch(`/api/follows?userId=${userId}`, {
    method:"DELETE"
  })


  if(!res.ok){
    throw new Error("Erreur unfollow")
  }


  return res.json()
}