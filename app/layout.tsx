import "./globals.css"
import type { ReactNode } from "react"

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr">
      <body className="w-screen bg-gradient-to-b from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center overflow-y-auto">
        {/* RESPONSIVE WRAPPER */}
        <div className="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] max-w-[900px] aspect-[220/280] my-4">
          {children}
        </div>
      </body>
    </html>
  )
}