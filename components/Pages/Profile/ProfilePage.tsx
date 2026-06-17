"use client"
import { useRef, useState, useEffect } from "react"

/* COMPONENTS */
import BookLayout from "@/components/layout/Layout"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/SideBar"
import CustomGrid from "@/components/ui/Grid/CustomGrid"
import ProfileButton from "@/components/ui/Button/ProfileButton"
import FooterLayout from "@/components/layout/Footer"

/* STYLE */
import { typography } from "@/styles/typography"


export default function ProfilePage({ onNavigate }) {
  const isSelf = true
  const [showFilters, setShowFilters] = useState(false)

  return (
    <BookLayout
      header={
        <Header
          showFilters={showFilters}
          items={[
            {
              label: "HOME",
              active: false,
            },
            {
              label: "FILTER",
              clickable: false,
            },
            {
              label: "CREATE",
              clickable: true,
              onClick: () => console.log("create"),
            },
          ]}
      />}
      sidebar={<Sidebar text="PROFILE" gap="gap-16" clickable={false} />}
    >

    <div className="flex flex-col h-full min-h-0">
      <CustomGrid
        left={
          <button className="bg-zinc-200 flex items-end p-4 h-full w-full text-left">
            <p className={typography.body}>silhouettes</p>
          </button>
        }

        topRight={
          <button className="bg-zinc-300 flex items-end p-4 h-full w-full text-left">
            <p className={typography.body}>saved</p>
          </button>
        }

        bottomRight={
          <button className="bg-zinc-400 flex items-end p-4 h-full w-full text-left">
            <p className={typography.body}>moodboard</p>
          </button>
        }
      />

        {/* FOOTER */}
      <FooterLayout>
        <div className="flex items-center gap-2">
          <button className={typography.buttonBody}>Settings</button>
          <span className={typography.bullet}>•</span>
          <button className={typography.buttonBody}>Loves</button>
        </div>
        <ProfileButton onNavigate={onNavigate} />
      </FooterLayout>


    </div>
    </BookLayout>
  )
}


