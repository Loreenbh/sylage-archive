/* CONTENT PAGE */
import BookLayout from "../Format/Layout"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export default function Authentification() {
  return (
    <BookLayout
      sidebar={
        <div className="flex flex-col items-center h-[530px] gap-50 w-[60px] bg-green-500 mt-50">
          <div className="w-px h-[180px] md:h-[120px] lg:h-[250px] bg-black" />
          <p className={`${roboto.className} text-4xl -rotate-90 w-[90px]`}>
            ACCESS
          </p>
        </div>
      }
    >

      {/* CENTRE = children */}
      <div className="flex flex-1 flex-col items-center justify-center mt-50">
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
      </div>

    </BookLayout>
  )
}