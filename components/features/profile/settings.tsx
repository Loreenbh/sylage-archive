"use client"

import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import FourSquaresGrid from "@/components/ui/grids/FourSquareGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"

/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
}

export default function Settings({ onNavigate }: Props) {
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
      sidebar={<Sidebar text="SETTINGS" clickable={false} />}
      footer={<ProfileButton onNavigate={onNavigate} />}
    >
      <FourSquaresGrid
        topLeft={
          <button className="h-full w-full bg-zinc-200 flex items-end p-4 hover:bg-zinc-300 transition">
            <span className={typography.body}>Edit</span>
          </button>
        }
        topRight={
          <button className="h-full w-full bg-zinc-300 flex items-end p-4 hover:bg-zinc-400 transition">
            <span className={typography.body}>Privacy</span>
          </button>
        }
        bottomLeft={
          <button className="h-full w-full bg-zinc-400 flex items-end p-4 hover:bg-zinc-500 transition">
            <span className={typography.body}>Notifications</span>
          </button>
        }
        bottomRight={
          <button className="h-full w-full bg-zinc-500 flex items-end p-4 hover:bg-zinc-600 transition">
            <span className={typography.body}>Appearance</span>
          </button>
        }
      />
    </BookLayout>
  )
}