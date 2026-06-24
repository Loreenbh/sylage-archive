"use client"
import { useRef, useState, useEffect } from "react"
import type { OnNavigate } from "@/types/navigation"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/SideBar"
import CustomGrid from "@/components/ui/grids/CustomGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import GridButton from "@/components/ui/buttons/GridButton"
/* STYLE */
import { typography } from "@/styles/typography"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
}
/*------------------------------------------------- */
export default function ProfilePage({ onNavigate }: Props) {
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
      sidebar={<Sidebar text="PROFILE" clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2">
          <button
            className={typography.buttonBody}
            onClick={() => onNavigate?.({ to: "settings", direction: "next" })}>
            Settings
          </button>

          <span className={typography.bullet}>•</span>

          <button
            className={typography.buttonBody}
            onClick={() => onNavigate?.({ to: "loves", direction: "next" })}>
            Loves
          </button>
        </div>
      }

      footer={
        <ProfileButton onNavigate={onNavigate} />
      }
    >
    <div className="flex flex-col h-full "> 
      <CustomGrid
        left={
          <GridButton
            className="bg-zinc-200 hover:bg-zinc-300"
            onClick={() => onNavigate?.({ to: "silhouettes", direction: "next" })}>
            <p className={typography.body}>silhouettes</p>
          </GridButton>
        }

        topRight={
          <GridButton
            className="bg-zinc-200 hover:bg-zinc-300"
            onClick={() => onNavigate?.({ to:"moods", direction: "next" })}>
            <p className={typography.body}>moods</p>
          </GridButton>
        }

        bottomRight={
          <button className="bg-zinc-400 flex items-end p-4 h-full w-full text-left">
            <p className={typography.body}>following</p>
          </button>
        }
      />
      </div>
    </BookLayout>
  )
}



