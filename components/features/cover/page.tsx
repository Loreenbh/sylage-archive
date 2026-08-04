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
/* TYPES */
type Props = {
  onNavigate: OnNavigate
}
/*-----------------------------------------------*/

export default function Cover({ onNavigate }: Props) {
  return (
    <BookLayout
      header={
        <div className={`${layout.coverHeader} ${spacing.coverHeader}`}>
          <h1 className={typography.title}>
            SYLAGE
          </h1>
          <p className={`${typography.subtitle} ${spacing.subtitle}`}>
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
        <p className={`${typography.actionBar} ${spacing.actionBar}`}>
          A visual archive of moods
        </p>
      }
    >
      <div className="flex flex-col">
        <SimpleGrid
          square={
            <div className={`${layout.coverImage}`}>
              <Image
                src="/texture.jpg"
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