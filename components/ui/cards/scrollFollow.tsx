import { useState } from "react"
import { Follow } from "@/types/follow"
import { typography } from "@/styles/typography"

type Props = {
  followingTitle: string
  followersTitle: string

  following: Follow[]
  followers: Follow[]
  onOpenProfile?: (item: Follow) => void
  onUnfollow?: (item: Follow) => void
  canManageFollow?: boolean
}

export default function ScrollFollow({
  followingTitle,
  followersTitle,
  following,
  followers,
  onOpenProfile,
  onUnfollow,
  canManageFollow = false,
}: Props) {

  const sortedFollowing = [...following].sort((a,b) =>
    a.username.localeCompare(b.username)
  )

  const sortedFollowers = [...followers].sort((a,b) =>
    a.username.localeCompare(b.username)
  )

  const [activeTab, setActiveTab] = useState<"following" | "followers">("following")

  const renderList = (
    items:Follow[],
    showUnfollow:boolean
  ) => (
    <div className="h-full flex flex-col p-4 min-h-0">

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 mt-3">

        {items.map((item)=>(
          <div 
            key={item.id}
            className="
                flex
                items-center
                justify-center
                gap-3
                w-full
              "
          >
          <button
            onClick={() => onOpenProfile?.(item)}
            className="
              hidden sm:flex
              w-10 h-10
              shrink-0
              rounded-full
              bg-zinc-300
              overflow-hidden
              items-center
              justify-center
            "
          >
              {item.avatar_url ? (
                <img
                  src={item.avatar_url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-black text-white">
                  {item.username[0].toUpperCase()}
                </span>
              )}
            </button>
          {/* <div className="flex flex-col w-24">*/}
          <div className="flex flex-col w-24 items-center"> 
              <button
                className={`${typography.follow} text-left`}
              >
                {item.username}
              </button>

              {showUnfollow && (
                <button
                  onClick={() => onUnfollow?.(item)}
                  className="
                    text-[10px]
                    text-left
                    opacity-40
                  "
                >
                  X
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
    return (
      <div className="h-full min-h-0 w-full flex flex-col overflow-hidden">

        <div className="flex border-b border-black/10 shrink-0">

          <button
            onClick={() => setActiveTab("following")}
            className={`
              flex-1 transition-opacity
              ${activeTab === "following"
                ? "opacity-100 border-b border-black"
                : "opacity-40"}
            `}
          >
            <span className={typography.buttonBody}>
              {followingTitle}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("followers")}
            className={`
              flex-1 transition-opacity
              ${activeTab === "followers"
                ? "opacity-100 border-b border-black"
                : "opacity-40"}
            `}
          >
            <span className={typography.buttonBody}>
              {followersTitle}
            </span>
          </button>
        </div>
        <div className="flex-1 min-h-0">
          {activeTab === "following"
            ? renderList(sortedFollowing, canManageFollow)
            : renderList(sortedFollowers, false)
          }
        </div>
      </div>
    )
}