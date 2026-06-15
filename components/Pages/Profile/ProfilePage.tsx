"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/layout/Layout"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/SideBar"
import CustomGrid from "@/components/ui/Grid/CustomGrid"
import { useRef, useState, useEffect } from "react"

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] })

export default function ProfilePage({ onNavigate }) {
  const isSelf = true
  const [showFilters, setShowFilters] = useState(false)

  return (
    <BookLayout
      // header={
      //   <Header
      //     showFilters={showFilters}
      //     items={[
      //       {
      //         label: "HOME",
      //         active: true,
      //       },
      //       {
      //         label: "FILTER",
      //         clickable: false,
      //       },
      //       {
      //         label: "CREATE",
      //         clickable: true,
      //         onClick: () => console.log("create"),
      //       },
      //     ]}
      // />}
      // sidebar={<Sidebar text="PROFILE" clickable={false} />}
    >

    <div className="flex flex-col h-full">
      <CustomGrid
        left={
          <div className="bg-zinc-200 flex items-end p-4 h-full">
            <p className="text-xs tracking-[0.2em] text-black/50">
              MY MOODBOARD
            </p>
          </div>
        }

        topRight={
          <div className="bg-zinc-300 flex items-end p-4 h-full">
            <p className="text-xs tracking-[0.2em] text-black/50">
              SAVED
            </p>
          </div>
        }

        bottomRight={
          <div className="bg-zinc-400 flex items-end p-4 h-full">
            <p className="text-xs tracking-[0.2em] text-black/50">
              LIKED
            </p>
          </div>
        }
      />
      <div className="flex items-center justify-between px-2 pt-4 pb-2">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        <button className="text-[10px] tracking-[0.35em] uppercase text-black/60">
          Settings
        </button>

        <span className="text-black/20 text-[10px]">•</span>

        <button className="text-[10px] tracking-[0.35em] uppercase text-black/60">
          Loves
        </button>
      </div>
      {/* RIGHT */}
      <div className="w-12 h-12 rounded-full bg-zinc-300" />
      </div>
    </div>

    
    </BookLayout>
  )
}
