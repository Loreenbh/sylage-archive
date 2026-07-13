import type { OnNavigate } from "@/types/navigation"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
  username?: string
  active?: boolean
  clickable?: boolean
}
/*------------------------------------------ */
export default function ProfileButton({ onNavigate , username, active = false, clickable = true}: Props) {
  return (
    <button
      disabled={!clickable}
      onClick={() => {
        if (!clickable) return
        onNavigate({
          to: "profile",
          direction: "next",
          params:{
            username: username,
            isOwner: true,
          }
        })
        console.log(username, "cest luser dans profile")
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