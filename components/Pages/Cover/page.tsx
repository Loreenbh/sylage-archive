import Image from "next/image"

/* COMPONENTS */
import BookLayout from "@/components/layout/Layout"
import Sidebar from "@/components/layout/SideBar"

/* STYLE */
import { layout } from "@/styles/layout"
import { spacing } from "@/styles/spacing"
import { roboto } from "@/styles/fonts"
import { typography } from "@/styles/typography"

export default function Cover({ onNavigate }) {
  return (
    <BookLayout
      header={
        <div className={`${roboto.className} ${spacing.cover.header}`}>
          <h1 className={`${roboto.className} ${typography.cover.title}`}>
            WEAVE
          </h1>
          <p className={`${roboto.className} ${typography.cover.subtitle} ${spacing.cover.subtitle}`}>
            TRENDBOOK
          </p>
        </div>
      }
      sidebar={<Sidebar text="26-27" clickable={true} onNavigate={onNavigate} />}
    >
      {/* CENTRE = children */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-0 px-2">
        <div className="flex items-center justify-center">
          <div className={`${spacing.cover.image} ${layout.cover.image}`}>
            <Image
              src="/cover.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
        <p className={`${roboto.className} ${typography.cover.label} ${spacing.cover.label}`}>
          A COLLECTIVE VISUAL MOOD SYSTEM
        </p>
      </div>
    </BookLayout>
  )
}

//<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  //  12px   14px         16px      18px


  // RootLayout
{/* <div className="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw]">
  //  90% viewport   85%          80%        75%
  //  MOBILE         PETIT ECRAN  TABLET     DESKTOP */}

//   Teste 3 tailles:
// - 375px (mobile)
// - 768px (tablet)
// - Fullscreen laptop (1440px+)
