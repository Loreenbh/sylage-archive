"use client"
import type { OnNavigate } from "@/types/navigation"
import Avatar from "../pagination/Avatar"
import { useCurrentUser } from "@/hooks/useCurrentUser"

/* TYPES */
type Props = {
  onNavigate: OnNavigate
  active?: boolean
  clickable?: boolean
}
/*------------------------------------------ */
export default function ProfileButton({ onNavigate, active = false, clickable = true}: Props) {
  const { user } = useCurrentUser()

  return (
    <button
      disabled={!clickable}
      onClick={() => {
        if (!clickable) return

        onNavigate({
          to:"profile",
          direction:"next",
          params:{
            isOwner:true
          }
        })
      }}
      className={`
        w-13 h-13 md:w-14 md:h-14 lg:w-18 lg:h-18
      `}
    >
      <Avatar
        user={user}
        className="
          w-full
          h-full
          rounded-full
        "
      />
    </button>
  )
}