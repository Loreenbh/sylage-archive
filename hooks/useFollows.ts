import { useEffect, useState } from "react"
import { getFollows } from "@/lib/services/follows"
import type { Follow } from "@/types/follow"

export function useFollows(userId?:number){

  const [following,setFollowing] = useState<Follow[]>([])
  const [followers,setFollowers] = useState<Follow[]>([])
  const [isLoading,setIsLoading] = useState(true)


  useEffect(()=>{

    async function load(){

      try {

        const data = await getFollows(userId)
        setFollowing(data.following)
        setFollowers(data.followers)

      } catch {

        setFollowing([])
        setFollowers([])

      } finally {

        setIsLoading(false)

      }

    }


    load()

  },[userId])


  return {
    following,
    followers,
    isLoading
  }

}