import { geometry } from "@/styles/geometry";

type Props = {
  children: React.ReactNode;
};

export default function BookFrame({ children }: Props) {

const layers = [
  {
    x: 2.0,
    y: 0,
    fromColor: "from-[#8F8173]",
    toColor: "to-[#75685C]",
  },
  {
    x: 1.65,
    y: 0.08,
    fromColor: "from-[#A09283]",
    toColor: "to-[#817365]",
  },
  {
    x: 1.3,
    y: 0.08,
    fromColor: "from-[#B0A091]",
    toColor: "to-[#918171]",
  },
  {
    x: 0.95,
    y: 0.04,
    fromColor: "from-[#BDAE9E]",
    toColor: "to-[#9F8F7E]",
  },
  {
    x: 0.6,
    y: 0,
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
                overflow-hidden
                bg-gradient-to-b
                ${layer.fromColor}
                ${layer.toColor}
              `}
              style={{
                transform: `translateX(${layer.x}cqw) translateY(${layer.y}cqw) rotateY(-${2.5 + i * 0.4}deg)`,
                boxShadow: `
                  inset 0 0.3cqw 1.2cqw rgba(33, 28, 25, 0.16),
                  inset 0 0 3cqw rgba(234, 227, 216, 0.20),
                  inset 0 1.5cqw 2.5cqw rgba(18, 15, 14, 0.18),
                  -${layer.x * 0.3}cqw 0 ${1.8 + i * 0.3}cqw rgba(33, 28, 25, ${0.18 + i * 0.02}),
                  inset -0.3cqw 0 0.6cqw rgba(33, 28, 25, 0.08)
                `,
              }}
            >
              {/* OMBRE EN HAUT, LUMIÈRE IVOIRE EN BAS */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-sm pointer-events-none"
                style={{
                  background: `
                    linear-gradient(
                      to bottom,
                      rgba(18, 15, 14, 0.58) 0%,
                      rgba(25, 21, 19, 0.40) 22%,
                      rgba(33, 28, 25, 0.18) 45%,
                      rgba(33, 28, 25, 0.04) 65%,
                      rgba(234, 227, 216, 0.10) 82%,
                      rgba(255, 253, 247, 0.22) 100%
                    )
                  `,
                }}
              />
            </div>
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
                  inset -0.3cqw 0 0.45cqw rgba(234, 227, 216, 0.35),
                  0.6cqw 0 1.8cqw rgba(33, 28, 25, 0.2)
                `,
              }}
            />

            {/*PROJECTEUR AU-DESSUS */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{
                background: `
                  linear-gradient(
                    to bottom,
                    rgba(18, 15, 14, 0.56) 0%,
                    rgba(25, 21, 19, 0.38) 16%,
                    rgba(33, 28, 25, 0.20) 34%,
                    rgba(33, 28, 25, 0.07) 49%,
                    transparent 63%
                  ),
                  radial-gradient(
                    ellipse 82% 62% at 50% 90%,
                    rgba(255, 253, 247, 0.46) 0%,
                    rgba(255, 249, 238, 0.24) 34%,
                    rgba(255, 249, 238, 0.08) 65%,
                    transparent 100%
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