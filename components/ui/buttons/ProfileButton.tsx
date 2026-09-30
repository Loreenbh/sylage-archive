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
        w-8 h-8 
        sm:w-14 
        sm:h-14 
        lg:w-20 
        lg:h-20
        text-[10px]
        sm:text-[16px]
        lg:text-[25px]
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
