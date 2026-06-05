/* Taille A4, fond, ombre, padding PAGE BLANCHE LA FEUILLE*/
export default function FormatCover({ children }) {
  return (
    <main
      className="
        relative
        w-[92vw]
        max-w-[650px]
        aspect-[210/297]
        bg-gradient-to-b from-zinc-50 to-zinc-200
        shadow-[10px_0_20px_rgba(0,0,0,0.6)]
        p-5
        flex
        flex-col
        ">
      {children}
    </main>
  )
}