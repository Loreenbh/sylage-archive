"use client"
import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ScrollableGrid from "@/components/ui/grids/ScrollableGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
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

export default function Moods({ onNavigate }: Props) {
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
        <Sidebar text="MOODS" clickable={false}/>
      }
      footer={
        <ProfileButton onNavigate={onNavigate} />
      }
    >    
      <div className="flex flex-col h-full "> 
        {/* GRID */}
        <ScrollableGrid
          data={moodboards}
          renderItem={(board) => (
            <div className="relative aspect-square w-full bg-zinc-100 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300" />
            </div>
          )}
        />
      </div>
    </BookLayout>
  )
}