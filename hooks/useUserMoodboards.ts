import { useEffect, useState } from "react"
import type { Moodboard } from "@/types/moodboard"
import { getUserMoodboards } from "@/lib/services/userMoodboards"

export function useUserMoodboards(userId?: number) {

  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    if (!userId) {
      setIsLoading(false)
      return
    }

    const currentUserId = userId

    async function loadMoodboards(){

      try {

        const data = await getUserMoodboards(currentUserId)

        setMoodboards(data)

      } catch {

        setMoodboards([])

      } finally {

        setIsLoading(false)

      }
    }

    loadMoodboards()

  }, [userId])


  return {
    moodboards,
    isLoading,
    setMoodboards
  }
}