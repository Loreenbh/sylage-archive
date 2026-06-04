export default function FormatDoublePage({ children }) {
  return (
    <main className="min-h-screen w-full bg-zinc-200 flex">
      
      <div className="
        w-full
        flex
        flex-col
        md:flex-row
        md:justify-between
        md:items-stretch
      ">
        {children}
      </div>

    </main>
  )
}