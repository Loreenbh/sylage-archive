/* Taille A4, fond, ombre, padding PAGE BLANCHE LA FEUILLE */

export default function Format({ children }) {
  return (
    <main
      className="
        relative
        w-[90vw] sm:w-[85vw] md:w-[80vw]
        max-w-[800px]
        aspect-[220/280]

        bg-gradient-to-b from-zinc-50 to-zinc-200
        shadow-[10px_0_20px_rgba(0,0,0,0.6)]

        p-5
        flex flex-col

        mx-auto
      "
    >
      {children}
    </main>
  )
}