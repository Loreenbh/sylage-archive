/* CONTENT PAGE */
import BookLayout from "../Format/Layout"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export default function Cover() {
  return (
    <BookLayout
      header={
        <div className=" bg-red text-center pt-10 space-y-4">
          <h1 className={`${roboto.className} ${typography.title}`}>
            WEAVE
          </h1>
          <p className={`${typography.subtitle} ml-32 md:ml-40 lg:ml-48`}>
            TRENDBOOK
          </p>
        </div>
      }
      sidebar={
        <div className="flex flex-col items-center h-[480px] gap-6 w-[60px] bg-green-500">
          <div className="w-px h-[180px] md:h-[120px] lg:h-[250px] bg-black" />
          <p className={`${roboto.className} text-4xl -rotate-90 w-[160px]`}>
            26–27
          </p>
        </div>
      }
    >

      {/* CENTRE = children */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center justify-center bg-blue-200">
          <div className="relative w-[380px] md:w-[500px] lg:w-[530px] aspect-square">
            <Image
              src="/cover.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
        <p className={`${typography.texte} mt-3 bg-blue-200 text-center`}>
          A COLLECTIVE VISUAL MOOD SYSTEM
        </p>
      </div>

    </BookLayout>
  )
}