// src/components/pages/Cover.tsx
import Image from "next/image";
import type { OnNavigate } from "@/types/navigation";
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import SimpleGrid from "@/components/ui/grids/SimpleGrid";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { geometry } from "@/styles/geometry";

type Props = {
  onNavigate: OnNavigate;
};

export default function Cover({ onNavigate }: Props) {
  return (
    <BookLayout
      header={
        <div className={geometry.header.content}>
          {/* PORTFOLIO */}
          <button
            onClick={() => {
              window.location.href = "https://sylage-world.vercel.app/";
            }}
            className={`${geometry.header.portfolio} ${typography.portfolio} text-black/20 hover:text-black/50 transition-colors duration-300 cursor-pointer`}
          >
            ← PORTFOLIO
          </button>

          {/* TITRE CENTRAL */}
          <div className={geometry.header.coverTitle}>
            <div className={geometry.header.coverImage}>
              <Image
                src="/title.png"
                alt="SYLAGE"
                fill
                priority
                className="object-contain object-center"
              />
            </div>
            <p
              className={`${geometry.header.coverSubtitle} ${typography.subtitle} ${colors.text.charcoal}`}
            >
              ARCHIVE
            </p>
          </div>
        </div>
      }
      sidebar={<Sidebar text="↓   26|27" clickable onNavigate={onNavigate} />}
      onPageClick={() =>
        onNavigate({
          to: "auth",
          direction: "next",
        })
      }
      pageClickLabel="Open the SYLAGE Archive"
      actionsBar={
        <p className={`${typography.actionBar} ${colors.text.charcoal}`}>
          A visual archive of moods
        </p>
      }
    >
      <div className="flex flex-col h-full w-full">
        <SimpleGrid
          square={
            <div className="flex h-full w-full justify-center relative">
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