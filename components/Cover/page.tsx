/* CONTENT PAGE */
import BookLayout from "../Format/Layout"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"
import Sidebar from "../Book/SideBar"
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export default function Cover( {onNavigate}) {
  return (
    <BookLayout
      header={
        <div className="text-center pt-10 space-y-4">
          <h1 className={`${roboto.className} ${typography.title}`}>
            WEAVE
          </h1>
          <p className={`${typography.subtitle} ml-32 md:ml-40 lg:ml-48`}>
            TRENDBOOK
          </p>
        </div>
      }
      sidebar={<Sidebar text="26--27" clickable={true} onNavigate={onNavigate}/>}
    >

      {/* CENTRE = children */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center justify-center bg-blue-200">
          <div className="relative w-[380px] md:w-[500px] lg:w-[610px] aspect-square">
            <Image
              src="/cover.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
        <p className={`${typography.texte} mt-3 text-center`}>
          A COLLECTIVE VISUAL MOOD SYSTEM
        </p>
      </div>

    </BookLayout>
  )
}