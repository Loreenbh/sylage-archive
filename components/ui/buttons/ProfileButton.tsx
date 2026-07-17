"use client"
import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
  active?: boolean
  clickable?: boolean
}
/*------------------------------------------ */
export default function ProfileButton({ onNavigate, active = false, clickable = true}: Props) {
  const [user_name, setUsername] = useState<string | null>(null)
  
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
                  rounded-full transition

                  ${
                    active
                    ? "bg-pink-200"
                    : "bg-green-600 hover:bg-green-100"
                  }
                  ${
                    !clickable
                    ? "cursor-default"
                    : "cursor-pointer"
                  }
                `}
    />
  )
}