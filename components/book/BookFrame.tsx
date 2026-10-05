import { geometry } from "@/styles/geometry";

type Props = {
  children: React.ReactNode;
};

export default function BookFrame({ children }: Props) {
  const layers = [
    {
      x: 3.7,
      y: 0,
      opacity: 0.7,
      fromColor: "from-[#8F8173]",
      toColor: "to-[#75685C]",
    },
    {
      x: 3.1,
      y: 0.15,
      opacity: 0.8,
      fromColor: "from-[#A09283]",
      toColor: "to-[#817365]",
    },
    {
      x: 2.5,
      y: 0.15,
      opacity: 0.85,
      fromColor: "from-[#B0A091]",
      toColor: "to-[#918171]",
    },
    {
      x: 1.9,
      y: 0.08,
      opacity: 0.9,
      fromColor: "from-[#BDAE9E]",
      toColor: "to-[#9F8F7E]",
    },
    {
      x: 1.2,
      y: 0,
      opacity: 0.92,
      fromColor: "from-[#C9BAA8]",
      toColor: "to-[#AC9C8A]",
    },
  ];

  return (
    <div
      className={geometry.page.container}
      style={{ perspective: "1200px" }}
    >
      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0">
          {/* PAPER LAYERS */}
          {layers.map((layer, i) => (
            <div
              key={i}
              className={`
                absolute
                inset-0
                rounded-sm
                bg-gradient-to-b
                ${layer.fromColor}
                ${layer.toColor}
              `}
              style={{
                transform: `translateX(${layer.x}cqw) translateY(${layer.y}cqw) rotateY(-${2.5 + i * 0.4}deg)`,
                opacity: layer.opacity,
                boxShadow: `
                  inset 0 0.3cqw 1.2cqw rgba(33, 28, 25, 0.08),
                  inset 0 0 3cqw rgba(234, 227, 216, 0.9),
                  -${layer.x * 0.3}cqw 0 ${1.8 + i * 0.3}cqw rgba(33, 28, 25, ${0.15 + i * 0.02}),
                  inset -0.3cqw 0 0.6cqw rgba(33, 28, 25, 0)
                `,
              }}
            />
          ))}

          {/* MAIN PAGE */}
          <main
            className={`${geometry.page.surface} bg-[#D2BFB2]`}
            style={{
              boxShadow: `
                1.5cqw 0 3cqw rgba(33, 28, 25, 0.6),
                inset 0 0 3cqw rgba(33, 28, 25, 0.08),
                inset -0.3cqw 0 0.9cqw rgba(33, 28, 25, 0.1)
              `,
            }}
          >
            {/* RELIURE GAUCHE */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[1.2cqw] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(33, 28, 25, 0.4) 0%, rgba(105, 98, 87, 0.2) 40%, rgba(105, 98, 87, 0.08) 100%, transparent 100%)",
                boxShadow: `
                  inset 0.3cqw 0 0.9cqw rgba(33, 28, 25, 0.3),
                  inset -0.3cqw 0 0.45cqw rgba(234, 227, 216, 0.8),
                  0.6cqw 0 1.8cqw rgba(33, 28, 25, 0.2)
                `,
              }}
            />

            {/* LUMIÈRE */}
            <div
              className="absolute inset-0 pointer-events-none rounded-sm"
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

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col h-full min-h-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}