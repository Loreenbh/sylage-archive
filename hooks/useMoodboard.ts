import { useEffect, useState } from "react"
import type { Moodboard } from "@/types/moodboard"

export function useMoodboard(id?: number) {
  const [moodboard, setMoodboard] = useState<Moodboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function loadMoodboard() {
      setIsLoading(true)

      try {
        const res = await fetch(`/api/moodboards/${id}`)
        console.log("appel API :", `/api/moodboards/${id}`)
        const data = await res.json()

        setMoodboard(data)

      } catch {
        setMoodboard(null)

      } finally {
        setIsLoading(false)
      }
    }

    loadMoodboard()

  }, [id])

  return {
    moodboard,
    isLoading
  }
}