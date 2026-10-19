import { useState } from "react";
import { Follow } from "@/types/follow";
import { typography } from "@/styles/typography";

type Props = {
  followingTitle: string;
  followersTitle: string;

  following: Follow[];
  followers: Follow[];
  onOpenProfile?: (item: Follow) => void;
  onUnfollow?: (item: Follow) => void;
  canManageFollow?: boolean;
};

export default function ScrollFollow({
  followingTitle,
  followersTitle,
  following,
  followers,
  onOpenProfile,
  onUnfollow,
  canManageFollow = false,
}: Props) {
  const sortedFollowing = [...following].sort((a, b) =>
    a.username.localeCompare(b.username),
  );

  const sortedFollowers = [...followers].sort((a, b) =>
    a.username.localeCompare(b.username),
  );

  const [activeTab, setActiveTab] = useState<"following" | "followers">(
    "following",
  );

  const renderList = (items: Follow[], showUnfollow: boolean) => (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0 w-[calc(100%-4px)] overflow-y-auto overflow-x-hidden sm:space-y-0 lg:space-y-1 mt-1 lg:mt-3 pr-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex
              items-center
              justify-start
              ml-1
              gap-2
              w-full
              sm:h-6
              md:h-7
              lg:h-8
              xl:h-20
            "
          >
            {/* AVATAR */}
            <button
              onClick={() => onOpenProfile?.(item)}
              className="
                flex
                sm:w-5
                sm:h-5
                md:w-6
                md:h-6
                lg:w-7
                lg:h-7
                xl:w-18
                xl:h-18
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
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-black text-white sm:text-[8px] lg:text-[14px]">
                  {" "}
                  {item.username[0].toUpperCase()}
                </span>
              )}
            </button>

            {/* USERNAME + X */}
            <div
              className="
                flex
                items-center
                min-w-0
                max-w-[120px]
                sm:max-w-[180px]
                lg:max-w-[260px]
              "
            >
              <button
                onClick={() => onOpenProfile?.(item)}
                className={`
                  ${typography.follow}
                  block
                  min-w-0
                  truncate
                  text-left
                `}
                title={item.username}
              >
                {item.username}
              </button>

              {showUnfollow && (
                <button
                  onClick={() => onUnfollow?.(item)}
                  className="
                    w-4
                    shrink-0
                    ml-1
                    text-left
                    sm:text-[11px]
                    md:w-[18px]
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
  );

  return (
    <div className="h-full min-h-0 w-full flex flex-col overflow-hidden">
      <div className="flex border-b border-black/10 shrink-0">
        <button
          onClick={() => setActiveTab("following")}
          className={`
            flex-1
            transition-opacity
            ${
              activeTab === "following"
                ? "opacity-100 border-b border-black"
                : "opacity-40"
            }
          `}
        >
          <span className="text-[clamp(5px,1.1cqw,8px)] sm:text-[clamp(6px,1.1cqw,10px)] md:text-[clamp(8px,1.1cqw,12px)] xl:text-[clamp(10px,1.1cqw,16px)] tracking-[0.1em] uppercase text-black/50">
            {followingTitle}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("followers")}
          className={`
            flex-1
            transition-opacity
            ${
              activeTab === "followers"
                ? "opacity-100 border-b border-black"
                : "opacity-40"
            }
          `}
        >
          <span className="text-[clamp(5px,1.1cqw,8px)] sm:text-[clamp(6px,1.1cqw,10px)] md:text-[clamp(8px,1.1cqw,12px)] xl:text-[clamp(10px,1.1cqw,16px)] tracking-[0.2em] uppercase text-black/50">
            {followersTitle}
          </span>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === "following"
          ? renderList(sortedFollowing, canManageFollow)
          : renderList(sortedFollowers, false)}
      </div>
    </div>
  );
}
