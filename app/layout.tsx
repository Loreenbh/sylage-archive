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
          relative
        `}
      >

        {/* SUNSET LIGHT */}
        <div
          className="
            fixed
            inset-0
            pointer-events-none
            z-[9999]
          "
          style={{
            background: `
              radial-gradient(
                ellipse 70% 90% at 0% 50%,
                rgba(232, 168, 120, 0.32) 0%,
                rgba(232, 168, 120, 0.12) 40%,
                transparent 75%
              ),
              radial-gradient(
                ellipse 50% 70% at 100% 60%,
                rgba(201, 167, 184, 0.12) 0%,
                transparent 75%
              )
            `,
          }}
        />

        <div
          className="
            w-[90vw]
            sm:w-[85vw]
            md:w-[80vw]
            lg:w-[75vw]
            max-w-[900px]
            aspect-[220/280]
            my-6
            sm:my-10
            md:my-14
          "
        >
          {children}
        </div>

      </body>
    </html>
  )
}
