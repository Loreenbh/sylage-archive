"use client"

import { useEffect, useState } from "react"
import { typography } from "@/styles/typography"
import { getCurrentUser } from "@/lib/services/auth"

export default function CurrentUserName() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser()

        if (data.user) {
          setUsername(data.user.username)
        }
      } catch {
        setUsername(null)
      }
    }

    loadUser()
  }, [])

  return (
    <div className={typography.body}>
      <span>
        {username ?? "guest"}
      </span>
    </div>
  )
}