import Format from "../Format/Format"
import { typography } from "@/styles/typography"
import { Roboto } from "next/font/google"
import Image from "next/image"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})


/* CONTENU DE LA COUVERTURE SUR LA FEUILLE BLANCHE*/
export default function Feed() {
  return (
      <Format>
        <></>
      </Format>
  )
}