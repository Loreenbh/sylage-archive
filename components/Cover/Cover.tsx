import Format from "../Format/Format"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})


/* CONTENU DE LA COUVERTURE SUR LA FEUILLE BLANCHE*/
export default function Cover() {
  return (
      <Format>
        {/* TOP */}
        <div className="text-center pt-10 space-y-4">
          <h1 className={`${roboto.className} ${typography.title}`}>
            WEAVE
          </h1>

          <p className={`${typography.subtitle} ml-32 md:ml-40 lg:ml-48`}>
            TRENDBOOK
          </p>
        </div>

        {/* CENTER BLOCK */}
        <div className="flex-1 flex flex-col items-center justify-center bg-red-200">

          {/* IMAGE + RIGHT SIDE */}
          <div className="flex items-center justify-center bg-blue-200">

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
            <div className="flex flex-col items-center h-[480px] gap-6 w-[60px]">

              {/* LINE */}
              <div className="w-px h-[180px] md:h-[120px] lg:h-[250px] bg-black" />

              {/* DATE */}
              <p className={`${roboto.className} text-4xl -rotate-90 w-[160px]`}>
                26–27
              </p>

            </div>

          </div>

          {/* CAPTION (EN DEHORS) */}
          <p className={`${typography.texte} mt-4 bg-blue-200 text-center`}>
            A COLLECTIVE VISUAL MOOD SYSTEM
          </p>

        </div>
      </Format>
  )
}