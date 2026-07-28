import { Follow } from "@/types/follow"

type Props = {
  followingTitle: string
  followersTitle: string

  following: Follow[]
  followers: Follow[]
  onOpenProfile?: (item: Follow) => void
  onUnfollow?: (item: Follow) => void
}

export default function ScrollFollow({
  followingTitle,
  followersTitle,
  following,
  followers,
  onOpenProfile,
  onUnfollow,
}: Props) {

  const sortedFollowing = [...following].sort((a,b) =>
    a.username.localeCompare(b.username)
  )

  const sortedFollowers = [...followers].sort((a,b) =>
    a.username.localeCompare(b.username)
  )


  const renderList = (
    title:string,
    items:Follow[],
    showUnfollow:boolean
  ) => (
    <div className="flex-1 flex flex-col p-4 min-h-0">

      <p className="text-sm uppercase tracking-widest text-center">
        {title}
      </p>


      <div className="flex-1 overflow-y-auto space-y-4 mt-3">

        {items.map((item)=>(
          <div 
            key={item.id}
            className="flex items-center justify-center gap-3"
          >

            <button
              onClick={() => onOpenProfile?.(item)}
              className="
                w-10 h-10 rounded-full
                bg-zinc-300 overflow-hidden
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


            <div className="flex flex-col">

              <button
                className="text-sm text-left"
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
                      transition
                      hover:opacity-100
                    "
                >
                  unfollow
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  )


  return (
    <div className="h-full w-full flex gap-1">

      {renderList(
        followingTitle,
        sortedFollowing,
        true
      )}

      {renderList(
        followersTitle,
        sortedFollowers,
        false
      )}

    </div>
  )
}