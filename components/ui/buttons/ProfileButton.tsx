"use client"
import { useState, useEffect } from "react"
import type { OnNavigate } from "@/types/navigation"
import { getCurrentUser } from "@/lib/services/auth"

/* TYPES */
type Props = {
  onNavigate: OnNavigate
  active?: boolean
  clickable?: boolean
}
/*------------------------------------------ */
export default function ProfileButton({ onNavigate, active = false, clickable = true}: Props) {
  const [user_name, setUsername] = useState<string | null>(null)
  
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
    <button
      disabled={!clickable}
      onClick={() => {
        if (!clickable) return
        onNavigate({
          to: "profile",
          direction: "next",
          params:{
            isOwner: true,
          }
        })
      }}
      className={`
              w-9 h-9 md:w-14 md:h-14 lg:w-18 lg:h-18
              rounded-full
              flex items-center justify-center
              transition
              font-serif
              text-white
              tracking-[0.2em]

              ${
                active
                ? "bg-pink-200"
                : "bg-black hover:bg-neutral-800"
              }

              ${
                !clickable
                ? "cursor-default"
                : "cursor-pointer"
              }
            `}
          >
            {user_name?.[0]?.toUpperCase() ?? "U"}
          </button>
        )
      }