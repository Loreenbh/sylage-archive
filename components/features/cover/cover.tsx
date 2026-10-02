import Image from "next/image";

/* TYPES */
import type { OnNavigate } from "@/types/navigation";

/* COMPONENT */
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import SimpleGrid from "@/components/ui/grids/SimpleGrid";

/* STYLE */
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
      header={
        <div className="relative w-full h-[40px] sm:h-[40px] md:h-[42px] lg:h-[105px] xl:h-[170px]">
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
              sm:text-[10px]
              md:text-[10px]
              lg:text-[13px]
              xl:text-[18px]
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
            className={`${layout.coverHeader} absolute inset-x-0 top-5 h-auto sm:top-5 md:top-5 lg:static lg:h-full lg:pt-8 lg:translate-y-3 xl:pt-[40px] xl:translate-y-4`}
          >
            <div className="relative w-full h-[30px] sm:h-[30px] md:h-[36px] lg:h-[80px] xl:h-[125px] shrink-0">
              <Image
                src="/title.png"
                alt="SYLAGE"
                fill
                priority
                className="object-contain object-center"
              />
            </div>

            <p
              className={`
                ${typography.subtitle}
                md:!text-[10px]
                lg:!text-[13px]
                xl:!text-[18px]
                ${spacing.subtitle}
                mt-1 sm:!mt-1 md:!mt-1 lg:!mt-0
                ${colors.text.charcoal}
                shrink-0
              `}
            >
              ARCHIVE
            </p>
          </div>
        </div>
      }
      sidebar={
        <Sidebar
          text="↓   26|27"
          clickable
          onNavigate={onNavigate}
        />
      }
      actionsBar={
        <p
          className={`
            ${typography.actionBar}
            ${spacing.actionBar}
            ${colors.text.charcoal}
          `}
        >
          A visual archive of moods
        </p>
      }
    >
      <div className="flex flex-col">
        <SimpleGrid
          square={
            <div className="flex h-full w-full justify-center">
              <div className={layout.coverImage}>
                <Image
                  src="/cover.png"
                  alt=""
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          }
        />
      </div>
    </BookLayout>
  );
}