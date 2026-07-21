import { useEffect, useState } from "react"
import type { Moodboard } from "@/types/moodboard"
import type { Silhouette } from "@/types/silhouette"
import type { User } from "@/types/user"

export function useProfile(
  userId?: number,
  isOwner?: boolean
) {
    const [user, setUser] = useState<User | null>(null)
    const [moodboards, setMoodboards] = useState<Moodboard[]>([])
    const [silhouettes, setSilhouettes] = useState<Silhouette[]>([])
    const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    if (!isOwner && !userId) {
      return
    }

    async function loadProfile() {

      setIsLoading(true)

      try {

        const url = isOwner
          ? "/api/users"
          : `/api/users?userId=${userId}`

        const res = await fetch(url)

        if (!res.ok) {
          throw new Error("Profile error")
        }

        const data = await res.json()

        setUser(data.user)
        setMoodboards(data.moodboards)
        setSilhouettes(data.silhouettes)

      } catch {

        setUser(null)
        setMoodboards([])
        setSilhouettes([])

      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()

  }, [userId, isOwner])


  return {
    user,
    moodboards,
    silhouettes,
    isLoading
  }
}