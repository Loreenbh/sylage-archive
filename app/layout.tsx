import "./globals.css";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { geometry } from "@/styles/geometry";

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
          h-dvh
          flex
          items-center
          justify-center
          overflow-hidden
          relative
        `}
      >
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

        <div
          className={`${geometry.viewport.className} portrait:hidden`}
          style={geometry.viewport.style}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
