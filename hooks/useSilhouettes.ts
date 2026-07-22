import { useEffect, useState } from "react"
import type { Silhouette } from "@/types/silhouette"
import { getSilhouetteData } from "@/lib/services/silhouette"
import type { User } from "@/types/user"

export function useSilhouettes(
  userId?: number,
  moodboardId?: number
) {

  const [silhouettes, setSilhouettes] = useState<Silhouette[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {

    async function loadSilhouettes(){

      try {

        const data = await getSilhouetteData(
          userId,
          moodboardId
        )

        setSilhouettes(data.silhouettes)
        setUser(data.user)
    
      } finally {
        setIsLoading(false)
      }

    }

    loadSilhouettes()

  }, [userId, moodboardId])


  return {
    silhouettes,
    user,
    isLoading,
    setSilhouettes
  }
}