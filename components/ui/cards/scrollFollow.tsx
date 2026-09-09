import { useState } from "react"
import { Follow } from "@/types/follow"
import { typography } from "@/styles/typography"
import { colors } from "@/styles/colors"

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
    items: Follow[],
    showUnfollow: boolean
  ) => (
    <div className="h-full flex flex-col min-h-0">

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 lg:space-y-2 mt-4 lg:mt-3">

        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex
              items-center
              justify-center
              gap-2
              w-full
              h-5
              sm:h-14
              lg:h-20
            "
          >

            {/* Avatar */}
            <button
              onClick={() => onOpenProfile?.(item)}
              className="
                hidden
                sm:flex
                sm:w-12
                sm:h-12
                md:w-13
                md:h-13
                lg:w-18
                lg:h-18
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

            {/* Username + X */}
            <div
              className="
                flex
                items-center
                justify-start
                w-30
                min-w-0
              "
            >
              <div className="w-24 min-w-0">
                <button
                  onClick={() => onOpenProfile?.(item)}
                  className={`
                    ${typography.follow}
                    block
                    w-full
                    truncate
                    text-left
                  `}
                  title={item.username}
                >
                  {item.username}
                </button>
              </div>

              {showUnfollow && (
                <button
                  onClick={() => onUnfollow?.(item)}
                  className="
                    w-4
                    shrink-0
                    ml-1
                    text-left
                    text-[11px]
                    md:text-[13px]
                    lg:text-[16px]
                    opacity-40
                  "
                >
                  x
                </button>
              )}
            </div>

          </div>
        ))}

      </div>
    </div>
  )
    return (
      <div className={`h-full min-h-0 w-full flex flex-col overflow-hidden`}>

        <div className="flex border-b border-black/10 shrink-0 sm:pt-2 lg:pt-4">

          <button
            onClick={() => setActiveTab("following")}
            className={`
              flex-1 transition-opacity
              ${activeTab === "following"
                ? "opacity-100 border-b border-black"
                : "opacity-40"}
            `}
          >
            <span className="text-[7px] sm:text-[12px] lg:text-[16px] tracking-[0.2em] uppercase text-black/50" >
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
            <span className="text-[7px] sm:text-[12px] lg:text-[16px] tracking-[0.2em] uppercase text-black/50">
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