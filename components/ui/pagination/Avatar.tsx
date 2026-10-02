import type { User } from "@/types/user";
import { colors } from "@/styles/colors";

type Props = {
  user?: User | null;
  className?: string;
};

export default function Avatar({ user, className = "" }: Props) {
  return (
    <div
      className={`
        rounded-full
        flex items-center justify-center
        overflow-hidden
        ${colors.bg.charcoal}
        text-white
        sm:text-[20px]
        md:text-[20px]
        lg:text-[12px]
        xl:text-[30px]
        font-serif
        tracking-[0.2em]
        ${className}
      `}
    >
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        (user?.username?.[0]?.toUpperCase() ?? "G")
      )}
    </div>
  );
}
