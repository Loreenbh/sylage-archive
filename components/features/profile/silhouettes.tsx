"use client"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/layout/SideBar"
import Header from "@/components/layout/Header"
import ThreeColGrid from "@/components/ui/grids/ThreeColGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"

/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
}

export default function Silhouettes({ onNavigate }: Props) {
  return (
    <BookLayout
      header={
        <Header
          items={[
            { label: "HOME" },
            { label: "FILTER" },
            { label: "CREATE" },
          ]}
        />
      }
      sidebar={<Sidebar text="SILHOUETTES" clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2">
          <button className={typography.buttonBody}>
            Forget password →
          </button>

          <span className={typography.bullet}>•</span>

          <button className={typography.buttonBody}>
            Settings
          </button>
        </div>
      }
      footer={
        <ProfileButton onNavigate={onNavigate} />
      }
    >
      <div className="flex flex-col h-full min-h-0 gap-1">

        <ThreeColGrid
          left={
            <button
              onClick={() =>
                onNavigate?.({ to: "discover", direction: "next" })
              }
              className="
                h-full w-full bg-zinc-200
                flex items-end p-4 text-left

                transition-all duration-300
                hover:translate-y-[-2px]
                hover:shadow-sm
                hover:bg-zinc-300
              "
            >
              silhouettes
            </button>
          }
          center={
            <button
              className="
                h-full w-full bg-zinc-300
                flex items-end p-4 text-left

                transition-all duration-300
                hover:translate-y-[-2px]
                hover:shadow-sm
              "
            >
              archive
            </button>
          }
          right={
            <button
              className="
                h-full w-full bg-zinc-400
                flex items-end p-4 text-left

                transition-all duration-300
                hover:translate-y-[-2px]
                hover:shadow-sm
              "
            >
              moodboard
            </button>
          }
        />

      </div>
    </BookLayout>
  )
}