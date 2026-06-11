import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen w-full bg-white flex items-center justify-center py-4 sm:py-6 md:py-10">

        <div
          className="
            w-full
            max-w-[900px]
            sm:w-[95vw]
            md:w-[90vw]
            lg:w-[900px]
            aspect-[220/280]
            sm:aspect-auto
          "
        >
          {children}
        </div>

      </body>
    </html>
  );
}