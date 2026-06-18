import Image from "next/image"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/Layout"
import Sidebar from "@/components/layout/SideBar"
/* STYLE */
import { spacing } from "@/styles/spacing"
import { typography } from "@/styles/typography"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
}
/*-----------------------------------------------*/

export default function Cover({ onNavigate }: Props) {
  return (
    <BookLayout
      header={
        <div className={`${spacing.header}`}>
          <h1 className={`${spacing.title} ${typography.title}`}>
            WEAVE
          </h1>
          <p className={`${typography.subtitle} ${spacing.subtitle}`}>
            TRENDBOOK
          </p>
        </div>
      }
      sidebar={<Sidebar text="↓26-27" gap={spacing.sidebar} clickable={true} onNavigate={onNavigate} />}
    >
      {/* CENTRE = children */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-0 px-2">
          <div className={`relative w-[250px] sm:w-[500px] md:w-[450px] lg:w-[700px] aspect-square
            mt-6 sm:mt-15 md:mt-20 lg:mt-20`}>
            <Image
              src="/texture.jpg"
              alt=""
              fill
              className="object-contain"
            />
        </div>
        <p className={`${typography.body} ${spacing.body}`}> 
          a collective visual mood system
        </p>
      </div>
    </BookLayout>
  )
}