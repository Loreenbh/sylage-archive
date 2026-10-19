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
  vertical?: boolean;
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
  vertical = false,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (disabled || isPending) return;

    if (onRequireAuth) {
      onRequireAuth();
      return;
    }

    const body =
      type === "moodboard" ? { moodboardId: id } : { silhouetteId: id };

    setIsPending(true);
    setHasError(false);

    try {
      const registerRes = await fetch("/api/likes", {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!registerRes.ok) {
        throw new Error("Like request failed");
      }

      setLiked(!liked);
      setCount((prev) => Math.max(0, prev + (liked ? -1 : 1)));
      onLike?.();
    } catch {
      setHasError(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} ${colors.text.charcoal} hover:text-white/40 transition-colors duration-300`}
      disabled={disabled || isPending}
      aria-label={hasError ? "Like action failed. Try again." : liked ? "Unlike" : "Like"}
      aria-busy={isPending}
      title={hasError ? "Could not update like. Please try again." : undefined}
    >
      {hasError && <span role="alert" className="mr-1 text-red-300">!</span>}
      {vertical ? (
        <span className="flex flex-col items-center gap-0.5 leading-none">
          <span>{liked ? "♥" : "♡"}</span>
          <span>{count}</span>
        </span>
      ) : (
        <>
          {liked ? "♥" : "♡"} {count}
        </>
      )}
    </button>
  );
}
