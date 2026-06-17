import Image from "next/image"

/* COMPONENTS */
import BookLayout from "@/components/layout/Layout"
import Sidebar from "@/components/layout/SideBar"

/* STYLE */
import { spacing } from "@/styles/spacing"
import { typography } from "@/styles/typography"

export default function Cover({ onNavigate }) {
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
      sidebar={<Sidebar text="26-27" gap="gap-6" clickable={true} onNavigate={onNavigate} />}
    >
      {/* CENTRE = children */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-0 px-2">
          <div className={`relative w-[230px] sm:w-[300px] md:w-[450px] lg:w-[400px] aspect-square
            mt-12 sm:mt-15 md:mt-20 lg:mt-30`}>
            <Image
              src="/texture.jpg"
              alt=""
              fill
              className="object-contain"
            />
        </div>
        <p className={`${typography.body} ${spacing.body}`}> 
          A COLLECTIVE VISUAL MOOD SYSTEM
        </p>
      </div>
    </BookLayout>
  )
}