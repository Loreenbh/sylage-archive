"use client";

import { ReactNode, useEffect, useRef } from "react";

type Props = {
  current: ReactNode;
  next: ReactNode | null;
  animating: boolean;
  direction: "next" | "prev";
  onDone: () => void;
  isCover: boolean;
};

export default function PageFlip({
  current,
  next,
  animating,
  direction,
  onDone,
  isCover,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!animating) return;
    if (!ref.current) return;

    const el = ref.current;

    el.style.transition = "none";
    el.style.opacity = "1";
    el.style.transform = "rotateY(0deg)";

    if (direction === "next") {
      // PAGE DROITE → tourne vers la gauche
      el.style.transformOrigin = "left center";

      void el.offsetWidth;

      el.style.transition =
        "transform 1200ms cubic-bezier(0.22, 0.61, 0.36, 1)";

      el.style.transform = "rotateY(-180deg)";
    }

    if (direction === "prev") {
      // PAGE GAUCHE → tourne vers la droite
      el.style.transformOrigin = "right center";

      void el.offsetWidth;

      el.style.transition =
        "transform 1200ms cubic-bezier(0.22, 0.61, 0.36, 1)";

      el.style.transform = "rotateY(180deg)";
    }

    const timer = setTimeout(() => {
      onDone();
    }, 1200);

    return () => clearTimeout(timer);
  }, [animating, direction, onDone]);

  /*
   * COVER
   *
   * La Cover reste une seule page lorsqu'elle est immobile.
   */
  if (isCover && !animating) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          perspective: "1800px",
        }}
      >
        <div className="relative w-1/2 h-full">
          {current}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full flex"
      style={{
        perspective: "1800px",
      }}
    >
      {/* PAGE GAUCHE */}
      <div
        className="
          relative
          w-1/2
          h-full
          shrink-0
          bg-[#D2BFB2]
          rounded-l-sm
          overflow-hidden
        "
        style={{
          boxShadow: `
            inset 0 0 20px rgba(33, 28, 25, 0.08),
            inset 2px 0 6px rgba(234, 227, 216, 0.5),
            inset -4px 0 8px rgba(33, 28, 25, 0.18)
          `,
        }}
      >
        {/* CONTENU PAGE GAUCHE */}
        {direction === "prev" && animating && (
          <div
            ref={ref}
            className="
              absolute
              inset-0
              pointer-events-none
            "
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              zIndex: 20,
            }}
          >
            {current}
          </div>
        )}

        {/* RELIURE CENTRALE */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(33, 28, 25, 0.4), rgba(105, 98, 87, 0.15), transparent)",
            boxShadow:
              "inset -2px 0 5px rgba(33, 28, 25, 0.25), 4px 0 10px rgba(33, 28, 25, 0.18)",
          }}
        />
      </div>

      {/* PAGE DROITE */}
      <div
        className="
          relative
          w-1/2
          h-full
          shrink-0
          overflow-hidden
        "
      >
        {animating ? next : current}
      </div>

      {/* PAGE DROITE QUI TOURNE → NEXT */}
      {animating && direction === "next" && (
        <div
          ref={ref}
          className="
            absolute
            top-0
            right-0
            w-1/2
            h-full
            pointer-events-none
          "
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            zIndex: 20,
          }}
        >
          {current}
        </div>
      )}
    </div>
  );
}
