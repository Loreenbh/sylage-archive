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
        {/* MESSAGE PORTRAIT */}
        <div
          className="
            hidden
            portrait:flex
            fixed
            inset-0
            z-[9999]
            items-center
            justify-center
            bg-[#211C19]
            text-[#EAE3D8]
          "
        >
          <p
            className="
              text-[10px]
              sm:text-[12px]
              tracking-[0.28em]
              font-light
              text-center
              uppercase
              px-8
            "
          >
            Rotate your device for full experience
          </p>
        </div>

        {/* APPLICATION */}
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
