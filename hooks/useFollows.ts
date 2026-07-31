import { useEffect, useState } from "react"
import { getFollows, unfollowUser } from "@/lib/services/follows"
import type { Follow } from "@/types/follow"

export function useFollows(userId?: number) {

  const [following, setFollowing] = useState<Follow[]>([])
  const [followers, setFollowers] = useState<Follow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function load() {
    try {
      const data = await getFollows(userId)

      setFollowing(data.following)
      setFollowers(data.followers)

    } catch {
      setFollowing([])
      setFollowers([])

    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    load()
  }, [userId])


  async function handleUnfollow(targetUserId: number) {

    await unfollowUser(targetUserId)

    await load()
  }


  return {
    following,
    followers,
    isLoading,
    handleUnfollow,
    refreshFollows: load
  }
}