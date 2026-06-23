import Image from "next/image"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/Layout"
import Sidebar from "@/components/layout/SideBar"
import Footer1 from "@/components/layout/Footer1"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
/* STYLE */
import { spacing } from "@/styles/spacing"
import { typography } from "@/styles/typography"
import SimpleGrid from "@/components/ui/grids/SimpleGrid"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
}
/*-----------------------------------------------*/

export default function Cover({ onNavigate }: Props) {
  return (
    <BookLayout
      header={
        <div className={spacing.header}>
          <h1 className={`${spacing.title} ${typography.title}`}>WEAVE</h1>
          <p className={`${typography.subtitle} ${spacing.subtitle}`}>
            TRENDBOOK
          </p>
        </div>
      }
      sidebar={
        <Sidebar text="↓   26|27" clickable={true} onNavigate={onNavigate} />
      }
      footer={
        <p className={`${typography.body} ${spacing.body}`}>
          a collective visual mood system
        </p>
      }
    >
      {/* BODY */}
      <div className="flex flex-col h-full min-h-0">

        <SimpleGrid
          square={
            <div className="relative w-[280px] sm:w-[500px] md:w-[550px] lg:w-[750px] aspect-square mx-auto">
              <Image
                src="/texture.jpg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          }
        />

      </div>
    </BookLayout>
  )
}