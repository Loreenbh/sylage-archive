"use client"

export default function Format({ children }) {
  const layers = [
    { x: 24, y: 0, z: 0, opacity: 0.7, fromColor: "from-zinc-100", toColor: "to-zinc-200" },
    { x: 20, y: 1, z: 1, opacity: 0.8, fromColor: "from-zinc-50", toColor: "to-zinc-150" },
    { x: 16, y: 1, z: 2, opacity: 0.85, fromColor: "from-zinc-75", toColor: "to-zinc-175" },
    { x: 12, y: 0.5, z: 3, opacity: 0.9, fromColor: "from-zinc-50", toColor: "to-zinc-150" },
    { x: 8, y: 0, z: 4, opacity: 0.92, fromColor: "from-zinc-25", toColor: "to-zinc-125" },
  ]

  return (
    <div className="w-full h-full flex flex-col" style={{ perspective: "1200px" }}>
      
      {/* Conteneur 3D */}
      <div className="relative flex-1 min-h-0">

        {/* COUCHES — pages empilées sur la droite */}
        {layers.map((layer, i) => (
          <div
            key={i}
            className={`absolute inset-0 rounded-sm bg-gradient-to-b ${layer.fromColor} ${layer.toColor}`}
            style={{
              transform: `translateX(${layer.x}px) translateY(${layer.y}px) rotateY(-${2.5 + i * 0.4}deg)`,
              opacity: layer.opacity,
              boxShadow: `
                inset 0 2px 8px rgba(139, 131, 131, 0.08),
                inset 0 0 20px rgb(255, 255, 255),
                -${layer.x * 0.3}px 0 ${12 + i * 2}px rgba(0,0,0,${0.15 + i * 0.02}),
                inset -2px 0 4px rgba(0,0,0,0.06)
              `,
            }}
          />
        ))}

        {/* PAGE PRINCIPALE */}
        <main
          className="
            absolute inset-0 rounded-sm
            w-full h-full
            bg-gradient-to-b from-zinc-50 to-zinc-200
            p-2 sm:p-3 md:p-4 lg:p-5
            flex flex-col
            overflow-hidden
          "
          style={{
            boxShadow: `
              10px 0 20px rgba(0,0,0,0.6),
              inset 0 0 40px rgba(255,255,255,0.5),
              inset 0 2px 8px rgba(255,255,255,0.3),
              inset -2px 0 6px rgba(0,0,0,0.1)
            `,
          }}
        >
          {/* RELIURE GAUCHE */}
          <div
            className="absolute left-0 top-0 bottom-0 w-2 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(100,100,100,0.2) 40%, rgba(120,120,120,0.08) 100%, transparent 100%)",
              boxShadow: `
                inset 2px 0 6px rgba(0,0,0,0.3),
                inset -2px 0 3px rgb(255, 255, 255),
                4px 0 12px rgba(0,0,0,0.2)
              `,
            }}
          />

          {/* EFFET BOMBÉ */}
          <div
            className="absolute inset-0 pointer-events-none rounded-sm"
            style={{
              background: `
                radial-gradient(
                  ellipse 60% 45% at 50% 35%,
                  rgba(255,255,255,0.5) 0%,
                  rgba(255,255,255,0.2) 30%,
                  transparent 70%
                )
              `,
            }}
          />

          {/* CONTENU */}
          <div className="relative z-10 flex flex-col h-full min-h-0">
            {children}
          </div>
        </main>

      </div>

    </div>
  )
}