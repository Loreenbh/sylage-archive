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

    if (direction === "next") {
      el.style.transformOrigin = "left center";
      el.style.transform = "rotateY(0deg)";

      void el.offsetWidth;

      el.style.transition =
        "transform 1200ms cubic-bezier(0.22, 0.61, 0.36, 1)";

      el.style.transform = "rotateY(-180deg)";
    }

    if (direction === "prev") {
      el.style.transformOrigin = "right center";
      el.style.transform = "rotateY(0deg)";

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
   * Lorsqu'elle se tourne, elle reprend exactement
   * l'animation de la page droite.
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

  /*
   * DOUBLE PAGE
   *
   * Pendant l'animation de la Cover, on affiche la prochaine
   * double page en dessous, puis la Cover tourne comme une page droite.
   */
  return (
    <div
      className="relative w-full h-full flex"
      style={{
        perspective: "1800px",
      }}
    >
      {/* PAGE GAUCHE VIDE */}
      <div
        className="
          relative
          w-1/2
          h-full
          shrink-0
          bg-[#D2BFB2]
          rounded-l-sm
        "
        style={{
          boxShadow: `
            inset 0 0 20px rgba(33, 28, 25, 0.08),
            inset 2px 0 6px rgba(234, 227, 216, 0.5),
            inset -4px 0 8px rgba(33, 28, 25, 0.18)
          `,
        }}
      >
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

      {/* PAGE QUI TOURNE */}
      {animating && (
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
