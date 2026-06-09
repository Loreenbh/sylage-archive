import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="
              -h-screen
              py-5
              flex
              items-center
              justify-center
              "
      >
        {children}
      </body>
    </html>
  )
}