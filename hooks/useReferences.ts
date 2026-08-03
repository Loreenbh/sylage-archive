// hooks/useReferences.ts

import { useEffect, useState } from "react"
import { getReferences } from "@/lib/services/references"

export function useReferences() {
  const [references, setReferences] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReferences() {
      try {
        const data = await getReferences()
        console.log("REFERENCES API :", data)
        setReferences(data)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferences()
  }, [])

  return {
    references,
    isLoading
  }
}