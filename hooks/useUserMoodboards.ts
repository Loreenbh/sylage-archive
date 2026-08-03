import { useEffect, useState } from "react"
import type { Moodboard } from "@/types/moodboard"
import { getUserMoodboards } from "@/hooks/userMoodboards"
import type { User } from "@/types/user"

export function useUserMoodboards(userId?: number, from?: string) {

  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {

    async function loadMoodboards(){

      try {

        const data = await getUserMoodboards(userId, from)

        setMoodboards(data.moodboards)

        if(data.user){
          setUser(data.user)
        }

      } catch {

        setMoodboards([])
        setUser(null)

      } finally {

        setIsLoading(false)

      }
    }

    loadMoodboards()

  }, [userId, from])


  return {
    moodboards,
    isLoading,
    user,
    setMoodboards
  }
}