"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  current: ReactNode;
  next: ReactNode | null;
  previousLeft: ReactNode | null;
  animating: boolean;
  direction: "next" | "prev";
  onDone: () => void;
  isCover: boolean;
};

export default function PageFlip({
  current,
  next,
  previousLeft,
  animating,
  direction,
  onDone,
  isCover,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef(current);
  const nextRef = useRef(next);
  const previousLeftRef = useRef(previousLeft);

  const [turnedPage, setTurnedPage] = useState<ReactNode | null>(null);
  const [previousPage, setPreviousPage] = useState<ReactNode | null>(null);
  const [turnedDirection, setTurnedDirection] = useState<
    "next" | "prev" | null
  >(null);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  useEffect(() => {
    previousLeftRef.current = previousLeft;
  }, [previousLeft]);

  useEffect(() => {
    if (!animating) return;
    if (!ref.current) return;

    const el = ref.current;
    const pageBeingTurned = currentRef.current;
    const pageRevealedByFlip = previousLeftRef.current;

    setTurnedPage(null);
    setPreviousPage(null);
    setTurnedDirection(null);

    el.style.transition = "none";
    el.style.opacity = "1";
    el.style.transform = "rotateY(0deg)";

    if (direction === "next") {
      // PAGE DROITE
      el.style.transformOrigin = "left center";

      void el.offsetWidth;

      el.style.transition =
        "transform 1200ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 250ms ease 550ms";

      el.style.transform = "rotateY(-180deg)";
      el.style.opacity = "0.15";
    }

    if (direction === "prev") {
      el.style.transformOrigin = "right center";

      void el.offsetWidth;

      el.style.transition =
        "transform 1200ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 250ms ease 550ms";

      el.style.transform = "rotateY(180deg)";
      el.style.opacity = "0.15";
    }

    const timer = setTimeout(() => {
      if (direction === "next") {
        setTurnedPage(pageBeingTurned);
        setTurnedDirection("next");
      } else {
        setPreviousPage(pageRevealedByFlip);
      }
      onDone();
    }, 1200);

    return () => clearTimeout(timer);
  }, [animating, direction, onDone]);

  if (isCover && !animating) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          perspective: "1800px",
        }}
      >
        <div className="relative w-1/2 h-full">{current}</div>
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
      {/* PAGE GAUCHE*/}
      <div
        className="
          relative
          w-1/2
          h-full
          shrink-0
          rounded-l-sm
          overflow-visible
        "
        style={{
          background: `
          radial-gradient(
            ellipse 100% 68% at 50% 110%,
            rgba(250, 245, 235, 0.68) 0%,
            rgba(245, 238, 225, 0.40) 28%,
            rgba(245, 238, 225, 0.18) 52%,
            transparent 82%
          ),
          linear-gradient(
            to bottom,
            rgba(25, 21, 19, 0.34) 0%,
            rgba(25, 21, 19, 0.16) 35%,
            rgba(25, 21, 19, 0.02) 68%,
            transparent 100%
          ),
          #A99A90
        `,
          boxShadow: `
            inset 0 0 20px rgba(33, 28, 25, 0.12),
            inset 2px 0 6px rgba(234, 227, 216, 0.22),
            inset -4px 0 8px rgba(33, 28, 25, 0.18)
          `,
        }}
      >
        {direction === "prev" && (animating || previousPage !== null) && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: "scaleX(-1)",
              opacity: 0.15,
            }}
          >
            {animating ? previousLeft : previousPage}
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
          overflow-visible
        "
      >
        {animating ? next : current}
      </div>

      {/* PAGE GAUCHE QUI TOURNE */}
      {direction === "prev" && animating && (
        <div
          ref={ref}
          className="
            absolute
            top-0
            left-0
            w-1/2
            h-full
            pointer-events-none
          "
          style={{
            transformStyle: "preserve-3d",
            zIndex: 20,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            {current}
          </div>
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            {next}
          </div>
        </div>
      )}

      {/* PAGE DROITE QUI TOURNE */}
      {direction === "next" && (animating || turnedDirection === "next") && (
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
            backfaceVisibility: "visible",
            zIndex: 20,
          }}
        >
          {animating ? current : turnedPage}
        </div>
      )}
    </div>
  );
}
