"use client";

import type { OnNavigate } from "@/types/navigation";
import Avatar from "../pagination/Avatar";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Props = {
  onNavigate: OnNavigate;
  active?: boolean;
  clickable?: boolean;
};

export default function ProfileButton({
  onNavigate,
  active = false,
  clickable = true,
}: Props) {
  const { user, isLoading } = useCurrentUser();

  const isClickable = clickable && !isLoading && Boolean(user);

  return (
    <button
      disabled={Boolean(!isClickable)}
      onClick={() => {
        if (!isClickable) return;

        onNavigate({
          to: "profile",
          direction: "next",
          params: {
            isOwner: true,
          },
        });
      }}
      className={`
        sm:w-7
        sm:h-7 
        md:w-12
        md:h-12
        lg:w-16
        lg:h-16
        xl:w-20
        xl:h-20
        sm:text-[16px]
        lg:text-[16px]
        xl:text-[25px]
        ${!isClickable ? "cursor-default opacity-50" : "cursor-pointer"}
      `}
    >
      <Avatar
        user={user}
        className={`
          w-full
          h-full
          rounded-full
        `}
      />
    </button>
  );
}
