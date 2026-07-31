import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/services/auth"
import { User } from "@/types/user"

export function useCurrentUser() {

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser()

        if (data.user) {
          setUser(data.user)
        }
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  return {
    user,
    isLoading
  }
}