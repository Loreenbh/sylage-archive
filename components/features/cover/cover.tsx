import Image from "next/image";
/*TYPES*/
import type { OnNavigate } from "@/types/navigation";
/*COMPONENT*/
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import SimpleGrid from "@/components/ui/grids/SimpleGrid";
/*STYLE*/
import { spacing } from "@/styles/spacing";
import { layout } from "@/styles/layout";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";

type Props = {
  onNavigate: OnNavigate;
};

export default function Cover({ onNavigate }: Props) {
  return (
    <BookLayout
      imageClassName="!mt-4 sm:!mt-2 md:!mt-4 lg:!mt-10"
      sidebarClassName="!mt-4 sm:!mt-2 md:!mt-4 lg:!mt-10 lg:!ml-10"
      header={
        <div className="relative w-full">
          {/* PORTFOLIO */}
          <button
            onClick={() => {
              window.location.href = "https://sylage-world.vercel.app/";
            }}
            className="
              absolute
              top-0
              left-0
              text-[10px]
              sm:text-[13px]
              md:text-[13px]
              lg:text-[18px]
              tracking-[0.18em]
              text-black/20
              hover:text-black/50
              transition-colors
              duration-300
              cursor-pointer
            "
          >
            ← PORTFOLIO
          </button>

          {/* TITRE */}
          <div
            className={`${layout.coverHeader} ${spacing.coverHeader}`}
            style={{
              paddingTop: "clamp(35px, 6vw, 65px)",
            }}
          >
            <div className="relative w-full h-[clamp(50px,10vw,100px)]">
              <Image
                src="/title.png"
                alt="SYLAGE"
                fill
                priority
                className="object-contain object-center"
              />
            </div>

            <p
              className={`${typography.subtitle} ${spacing.subtitle} ${colors.text.charcoal}`}
            >
              ARCHIVE
            </p>
          </div>
        </div>
      }
      sidebar={
        <Sidebar text="↓   26|27" clickable={true} onNavigate={onNavigate} />
      }
      actionsBar={
        <p
          className={`${typography.coverLabel}
          ${spacing.coverLabel}
          ${colors.text.charcoal}`}
        >
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
  );
}
