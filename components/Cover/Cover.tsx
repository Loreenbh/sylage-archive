import Image from "next/image"

export default function FormatPage({ children }) {
  return (
    <main
      className="
        relative
        w-[92vw]
        max-w-[650px]
        aspect-[210/297]
        bg-gradient-to-b from-zinc-50 to-zinc-200
        p-5
        flex
        flex-col
        overflow-hidden
      "
    >
      {children}

      {/* OVERLAY MAGAZINE */}
      <Image
        src="/test.png"
        alt=""
        fill
        className="object-cover pointer-events-none z-0 opacity-10"
      />
    </main>
  )
}