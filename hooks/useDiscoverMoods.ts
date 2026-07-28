"use client"

import { useEffect, useState } from "react"
import type { Moodboard } from "@/types/moodboard"
import { getDiscoverMoodboards } from "@/lib/services/moodboard"

export function useDiscoverMoodboards(sort: "latest" | "curated" | "following") {

  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    let cancelled = false

    async function loadMoodboards() {

      setIsLoading(true)

      try {

        const data = await getDiscoverMoodboards(sort)

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

  }, [sort])


  return {
    moodboards,
    setMoodboards,
    isLoading
  }
}