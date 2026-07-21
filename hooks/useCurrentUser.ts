import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/services/auth"
import { User } from "@/types/user"

export function useCurrentUser() {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function loadUser() {
      const data = await getCurrentUser()

      if (data.user) {
        setUser(data.user)
      }
    }

    loadUser()
  }, [])

  return {
    user
  }
}