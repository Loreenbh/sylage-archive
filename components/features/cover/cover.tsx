import Image from "next/image"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
/* STYLE */
import { spacing } from "@/styles/spacing"
import { layout } from "@/styles/layout"
import { typography } from "@/styles/typography"
import SimpleGrid from "@/components/ui/grids/SimpleGrid"
import { colors } from "@/styles/colors"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
}
/*-----------------------------------------------*/

export default function Cover({ onNavigate }: Props) {
  return (
    <BookLayout
      imageClassName="!mt-4 sm:!mt-2 md:!mt-4 lg:!mt-10"
      sidebarClassName="!mt-4 sm:!mt-2 md:!mt-4 lg:!mt-10 lg:!ml-10"
      header={
        <div className={`${layout.coverHeader} ${spacing.coverHeader}`}>
          <h1 className={`${typography.title} ${colors.text.charcoal}`}>
            SYLAGE
          </h1>
          <p className={`${typography.subtitle} ${spacing.subtitle} ${colors.text.charcoal}`}>
            TRENDBOOK
          </p>
        </div>
      }
      sidebar={
        <Sidebar 
          text="↓   26|27"
          clickable={true} 
          onNavigate={onNavigate} 
        />
      }
      actionsBar={
        <p className={`${typography.coverLabel}
          ${spacing.coverLabel}
          ${colors.text.charcoal}`}>
          A visual archive of moods
        </p>
      }
    >
      <div className="flex flex-col">
        <SimpleGrid
          square={
            <div className={`${layout.coverImage}`}>
              <Image
                src="/cover.png"
                alt=""
                fill
                priority
                className="object-contain"
              />
            </div>
          }
        />
    </div>
    </BookLayout>
  )
}