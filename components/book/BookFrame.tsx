"use client";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function BookFrame({ children }: Props) {
  const layers = [
    {
      x: 24,
      y: 0,
      z: 0,
      opacity: 0.7,
      fromColor: "from-[#8F8173]",
      toColor: "to-[#75685C]",
    },
    {
      x: 20,
      y: 1,
      z: 1,
      opacity: 0.8,
      fromColor: "from-[#A09283]",
      toColor: "to-[#817365]",
    },
    {
      x: 16,
      y: 1,
      z: 2,
      opacity: 0.85,
      fromColor: "from-[#B0A091]",
      toColor: "to-[#918171]",
    },
    {
      x: 12,
      y: 0.5,
      z: 3,
      opacity: 0.9,
      fromColor: "from-[#BDAE9E]",
      toColor: "to-[#9F8F7E]",
    },
    {
      x: 8,
      y: 0,
      z: 4,
      opacity: 0.92,
      fromColor: "from-[#C9BAA8]",
      toColor: "to-[#AC9C8A]",
    },
  ];

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ perspective: "1200px" }}
    >
      <div className="relative flex-1 min-h-0">
        {layers.map((layer, i) => (
          <div
            key={i}
            className={`
              absolute inset-0 rounded-sm
              bg-gradient-to-b
              ${layer.fromColor}
              ${layer.toColor}
            `}
            style={{
              transform: `translateX(${layer.x}px) translateY(${layer.y}px) rotateY(-${2.5 + i * 0.4}deg)`,
              opacity: layer.opacity,
              boxShadow: `
                inset 0 2px 8px rgba(33, 28, 25, 0.08),
                inset 0 0 20px rgba(234, 227, 216, 0.9),
                -${layer.x * 0.3}px 0 ${12 + i * 2}px rgba(33, 28, 25, ${0.15 + i * 0.02}),
                inset -2px 0 4px rgba(33, 28, 25, 0)
              `,
            }}
          />
        ))}

        {/* PAGE PRINCIPALE */}
        <main
          className="
            absolute inset-0 rounded-sm
            w-full h-full
            bg-[#D2BFB2]
            p-2 sm:p-3 md:p-4 lg:p-5
            flex flex-col
            overflow-hidden
          "
          style={{
            boxShadow: `
              10px 0 20px rgba(33, 28, 25, 0.6),
              inset 0 0 20px rgba(33, 28, 25, 0.08),
              inset -2px 0 6px rgba(33, 28, 25, 0.1)
            `,
          }}
        >
          {/* AMBIANCE */}
          <div
            className="
              absolute inset-0
              pointer-events-none
              rounded-sm
              z-20
            "
            style={{
              background: `
              radial-gradient(
                ellipse 70% 95% at 0% 50%,
                rgba(255, 253, 244, 0.68) 0%,
                rgba(255, 253, 244, 0.50) 10%,
                rgba(255, 253, 244, 0.28) 25%,
                rgba(255, 253, 244, 0.12) 45%,
                rgba(255, 253, 244, 0.04) 65%,
                transparent 80%
              )
            `,
            }}
          />
          {/* RELIURE GAUCHE */}
          <div
            className="
              absolute left-0 top-0 bottom-0
              w-2 pointer-events-none
            "
            style={{
              background:
                "linear-gradient(to right, rgba(33, 28, 25, 0.4) 0%, rgba(105, 98, 87, 0.2) 40%, rgba(105, 98, 87, 0.08) 100%, transparent 100%)",
              boxShadow: `
                inset 2px 0 6px rgba(33, 28, 25, 0.3),
                inset -2px 0 3px rgba(234, 227, 216, 0.8),
                4px 0 12px rgba(33, 28, 25, 0.2)
              `,
            }}
          />

          <div
            className="
              absolute inset-0
              pointer-events-none rounded-sm
            "
            style={{
              background: `
                radial-gradient(
                  ellipse 60% 45% at 50% 35%,
                  rgba(255,255,255,0.4) 0%,
                  rgba(255,255,255,0.15) 30%,
                  transparent 70%
                )
              `,
            }}
          />

          <div className="relative z-10 flex flex-col h-full min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
