import FormatPage from "@/components/Cover/Cover"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export default function Home() {
  return (
    <FormatPage>

      {/* TOP */}
      <div className="text-center pt-10 space-y-4 ">
        <h1 className={`${roboto.className} ${typography.title}`}>
          WEAVE
        </h1>

        <p className={`${typography.subtitle} ml-32 md:ml-40 lg:ml-48`}>
          TRENDBOOK
        </p>
      </div>

      {/* CENTER BLOCK */}
      <div className="flex-1 flex flex-col items-center justify-center relative left-5 bg-red-200">

        {/* IMAGE + RIGHT SIDE */}
        <div className="flex items-center justify-center gap-8 bg-blue-200">

          {/* IMAGE */}
          <div className="relative w-[260px] md:w-[320px] lg:w-[480px] aspect-square">
            <Image
              src="/cover.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center h-[500px] bg-green-200">

            {/* LINE */}
            <div className="w-px flex-1 bg-black/20" />

            {/* DATE */}
            <p className={`${roboto.className} text-xs rotate-270 bg-black`}>
              26–27
            </p>

          </div>

        </div>

        {/* CAPTION (EN DEHORS) */}
        <p className={`${typography.texte} mt-4 bg-blue-200 text-center`}>
          A COLLECTIVE VISUAL MOOD SYSTEM
        </p>

      </div>
    </FormatPage>
  )
}