"use client"
import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"
/* COMPONENTS */
import BookLayout from "@/components/book/Layout"
import Sidebar from "@/components/layout/SideBar"
import Header from "@/components/layout/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import FooterLayout from "@/components/layout/Footer"
/*STYLE*/
import { typography } from "@/styles/typography"
import { spacing } from "@/styles/spacing"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
}
/*---------------------------------------------------- */
const moodboards = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  user: `user_${String(i + 1).padStart(2, "0")}`,
}))

export default function Discover({ onNavigate }: Props) {
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
      sidebar={
        <Sidebar text="DISCOVER" clickable={true} onNavigate={onNavigate}/>
      }
    >    
      <div className="flex flex-col h-full "> 
        {/* GRID */}
        <ScrollableGrid
          data={moodboards}
          renderItem={(board) => (
            <div className="relative aspect-square w-full bg-zinc-100 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300" />

              <p className="absolute bottom-2 left-2 text-[9px] tracking-[0.2em] text-black/30">
                {board.user}
              </p>
            </div>
          )}
        />
        <FooterLayout>
          <div className="flex items-center gap-1 sm:gap-6">
            <button className={typography.buttonBody}>new</button>

            <span className={typography.bullet}>•</span>

            <button className={typography.buttonBody}>featured</button>

            <span className={typography.bullet}>•</span>

            <button className={typography.buttonBody}>following</button>
          </div>

          <ProfileButton onNavigate={onNavigate} />
        </FooterLayout>
      </div>

    </BookLayout>
  )
}