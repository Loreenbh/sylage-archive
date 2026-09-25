import { useState, useEffect } from "react";
import { colors } from "@/styles/colors";

type Props = {
  type: "moodboard" | "silhouette";
  id: number;
  initialCount?: number;
  initialLiked?: boolean;
  onLike?: () => void;
  onRequireAuth?: () => void;
  className: string;
  disabled?: boolean;
};

export default function LikeButton({
  type,
  id,
  initialCount = 0,
  initialLiked = false,
  onLike,
  onRequireAuth,
  className = "",
  disabled = false,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (disabled) return;

    if (onRequireAuth) {
      onRequireAuth();
      return;
    }

    const body =
      type === "moodboard" ? { moodboardId: id } : { silhouetteId: id };

    if (!liked) {
      const registerRes = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (registerRes.ok) {
        setLiked(true);
        setCount((prev) => prev + 1);
      }
    } else {
      const registerRes = await fetch("/api/likes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (registerRes.ok) {
        setLiked(false);
        setCount((prev) => Math.max(0, prev - 1));
      }
    }

    onLike?.();
  };
  return (
    <button
      onClick={handleClick}
      className={`${className} ${colors.text.charcoal} hover:text-white/40 transition-colors duration-300`}
      disabled={disabled}
    >
      {liked ? "♥" : "♡"} {count}
    </button>
  );
}
