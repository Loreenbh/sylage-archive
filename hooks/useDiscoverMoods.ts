"use client"

import { useEffect, useState } from "react"
import type { Moodboard } from "@/types/moodboard"
import { getDiscoverMoodboards } from "@/lib/services/moodboard"

export function useDiscoverMoodboards() {

  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    let cancelled = false

    async function loadMoodboards() {

      setIsLoading(true)

      try {

        const data = await getDiscoverMoodboards()

        if (!cancelled) {
          setMoodboards(data)
        }

      } catch {

        if (!cancelled) {
          setMoodboards([])
        }

      } finally {

        if (!cancelled) {
          setIsLoading(false)
        }

      }
    }

    loadMoodboards()

    return () => {
      cancelled = true
    }

  }, [])


  return {
    moodboards,
    setMoodboards,
    isLoading
  }
}