import "./globals.css";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata = {
  title: "SYLAGE Archive",
  description: "A visual archive of moods",
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
          overflow-hidden
          relative
        `}
      >
        <div
          className="
            w-[96vw]
            sm:w-[94vw]
            md:w-[94vw]
            lg:w-[90vw]
            max-w-[calc((100dvh-16px)*1.571)]
            aspect-[440/280]
            my-0
          "
        >
          {children}
        </div>
      </body>
    </html>
  );
}
