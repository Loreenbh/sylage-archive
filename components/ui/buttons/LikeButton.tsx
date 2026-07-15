import { useState } from "react"
import { Moodboard } from "@/types/moodboard"

type Props = {
  moodboardId: number
  initialCount?: number
  initialLiked?: boolean
  onLike?: () => void
  className: string
}

export default function LikeButton({
  moodboardId,
  initialCount = 0,
  initialLiked = false,
  onLike,
  className = ""
}: Props) {

  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)


  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!liked) {
        const registerRes = await fetch("/api/likes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          moodboardId: moodboardId ,
        })
      })
      
      if (registerRes.ok){
        setLiked(true)
        setCount((prev) => prev + 1)
      }
    } else {
      const registerRes = await fetch("/api/likes", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          moodboardId: moodboardId ,
        })
      })
      
      if (registerRes.ok){
        setLiked(false)
        setCount((prev) => prev - 1)
      }
    }
    onLike?.()
  }


  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {liked ? "♥" : "♡"} {count}
    </button>
  )
}