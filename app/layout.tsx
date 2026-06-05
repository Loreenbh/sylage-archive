import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="
              min-h-screen
              flex
              items-center
              justify-center
              translate-x-20
              "
      >
        {children}
      </body>
    </html>
  )
}