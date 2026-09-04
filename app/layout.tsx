import "./globals.css"
import type { ReactNode } from "react"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr">
      <body
        className={`
          ${roboto.className}
          w-screen
          min-h-screen
          flex
          items-center
          justify-center
          overflow-y-auto
        `}
      >
        <div className="
          w-[90vw] 
          sm:w-[85vw] 
          md:w-[80vw] 
          lg:w-[75vw] 
          max-w-[900px] 
          aspect-[220/280] 
          my-6
          sm:my-10
          md:my-14">
          {children}
        </div>
      </body>
    </html>
  )
}