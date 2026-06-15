/* CONTENT PAGE */
import BookLayout from "@/components/layout/Layout"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"
import Sidebar from "@/components/layout/SideBar"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export default function Cover({ onNavigate }) {
  return (
    <BookLayout
      header={
        <div className="text-center pt-2 sm:pt-4 md:pt-6 lg:pt-10 space-y-2 sm:space-y-3 md:space-y-4">
          <h1 className={`${roboto.className} ${typography.title}`}>
            WEAVE
          </h1>
          <p className={`${typography.subtitle} ml-20 sm:ml-28 md:ml-32 lg:ml-48`}>
            TRENDBOOK
          </p>
        </div>
      }
      sidebar={<Sidebar text="26 / 27" clickable={true} onNavigate={onNavigate} />}
    >
      {/* CENTRE = children */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-0 px-2 mt-10 sm:mt-12 md:mt-20 lg-mt-30">
        <div className="flex items-center justify-center">
          <div className=" bg-blue-200 relative w-[250px] sm:w-[500px] md:w-[500px] lg:w-[700px] aspect-square">
            <Image
              src="/cover.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
        <p className={`${typography.texte} mt-4 sm:mt-3 md:mt-4 text-center text-xs sm:text-sm`}>
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
