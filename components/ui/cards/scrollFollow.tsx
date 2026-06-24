type FollowItem = {
  id: number
  user: string
  avatar?: string
}

type Props = {
  title: string
  items: FollowItem[]
  onOpenProfile?: (item: FollowItem) => void
  onUnfollow?: (item: FollowItem) => void
}

export default function ScrollFollow({
  title,
  items,
  onOpenProfile,
  onUnfollow,
}: Props) {
  return (
    <div className="h-full w-full flex flex-col p-4">

      {/* title */}
      <p className="text-sm uppercase tracking-widest text-center">
        {title}
      </p>

      {/* list */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 mt-3">

        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-center gap-3">

            {/* avatar → profile */}
            <button
              onClick={() => onOpenProfile?.(item)}
              className="w-10 h-10 rounded-full bg-zinc-300 overflow-hidden flex-shrink-0"
            >
              {item.avatar && (
                <img
                  src={item.avatar}
                  className="w-full h-full object-cover"
                  alt=""
                />
              )}
            </button>

            {/* text block */}
            <div className="flex flex-col">

              {/* username → unfollow */}
              <button
                onClick={() => onUnfollow?.(item)}
                className="text-sm opacity-80 hover:opacity-100 text-left"
              >
                {item.user}
              </button>

              {/* secondary label */}
              <span className="text-[10px] opacity-40 tracking-wide">
                unfollow
              </span>

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}