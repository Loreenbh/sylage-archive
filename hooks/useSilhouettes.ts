import { useEffect, useState } from "react"
import type { Silhouette } from "@/types/silhouette"
import { getSilhouetteData } from "@/lib/services/silhouette"
import type { User } from "@/types/user"

export function useSilhouettes(
  userId?: number,
  moodboardId?: number,
  from?: string

) {

  const [silhouettes, setSilhouettes] = useState<Silhouette[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {

    async function loadSilhouettes(){

      try {

        const data = await getSilhouetteData(
          userId,
          moodboardId,
          from
        )

        setSilhouettes(data.silhouettes)
        setUser(data.user)
    
      } finally {
        setIsLoading(false)
      }

    }

    loadSilhouettes()

  }, [userId, moodboardId, from])


  return {
    silhouettes,
    user,
    isLoading,
    setSilhouettes
  }
}