"use client"
/* COMPONENTS */
import BookLayout from "@/components/layout/Layout"
import Sidebar from "@/components/layout/SideBar"
import TwoColGrid from "@/components/ui/Grid/TwoColGrid"
import Header from "@/components/layout/Header"
import FooterLayout from "@/components/layout/Footer"

/* STYLE */
import { typography } from "@/styles/typography"

function MagazineInput({ placeholder, type = "text", index }) {
  return (
    <div className="w-full flex space-y-6 px-2">
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-[100%] border-0 border-b border-black/40 bg-transparent
            text-[10px] sm:text-sm md:text-base font-light outline-none
            placeholder:text-black/30
            focus:border-black/30
            transition-colors duration-200
          `}
        />
        <span
          className={`
            text-[35px] sm:text-2xl md:text-3xl font-light 
            text-black/30 shrink-0 leading-none`}
        >
          {String(index).padStart(2, "0")}
        </span>
    </div>
  )
}

export default function Authentification({ onNavigate }) {
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
      sidebar={<Sidebar text="ACCESS" gap="gap-14" clickable={false} />}
    >
      <TwoColGrid
        left={
          <div className="bg-pink-200 flex flex-col justify-between h-full">
            <div className="pt-20">
              <MagazineInput placeholder="Pseudo" index={1} />
              <MagazineInput placeholder="Email" index={2} />
              <MagazineInput placeholder="Password" index={3} />
              <MagazineInput placeholder="Confirm password" index={4} />
            </div>

            <button
              onClick={() => onNavigate({ to: "discover", direction: "next" })}
              className={`${typography.buttonAuth}`}>
              Join →
            </button>
          </div>
        }
        right={
          <div className="bg-pink-300 flex flex-col justify-between h-full">
            <div className="pt-20">
              <MagazineInput placeholder="Email/username" index={1} />
              <MagazineInput placeholder="Password" index={2} />
            </div>

            <button
              className={`${typography.buttonAuth}`}>
              Enter →
            </button>
          </div>
        }
        footer={
          <FooterLayout>
            <div className="flex items-center gap-2">
              <button className={typography.buttonBody}>Forget password →</button>
            </div>
          </FooterLayout>
        }
      />
    </BookLayout>
  )
}
