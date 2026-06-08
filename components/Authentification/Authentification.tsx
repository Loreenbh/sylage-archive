import Format from "../Format/Format"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})


/* CONTENU DE LA COUVERTURE SUR LA FEUILLE BLANCHE*/
export default function Authentification() {
  return (
      <Format>
          {/* TOP */}
          <div className="text-center pt-10 space-y-4">
            <p className={`${typography.subtitle} ml-32 md:ml-40 lg:ml-48`}>
              TSESTTTTT
            </p>
          </div>

      </Format>
  )
}