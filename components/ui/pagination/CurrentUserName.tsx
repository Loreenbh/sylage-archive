"use client"

import { useEffect, useState } from "react"
import { typography } from "@/styles/typography"

export default function CurrentUserName() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me")
      const data = await res.json()

      if (data.user) {
        setUsername(data.user.username)
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