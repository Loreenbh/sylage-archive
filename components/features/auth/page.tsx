"use client"
import type { OnNavigate } from "@/types/navigation"
/* COMPONENTS */
import BookLayout from "@/components/book/Layout"
import Sidebar from "@/components/layout/SideBar"
import TwoColGrid from "@/components/ui/grids/TwoColGrid"
import Header from "@/components/layout/Header"
import FooterLayout from "@/components/layout/Footer"
/* STYLE */
import { typography } from "@/styles/typography"
import { spacing } from "@/styles/spacing"

/*TYPES*/
type Props = {
  onNavigate: OnNavigate
}

type Props1 = {
  placeholder: string
  type?: string
  index: number
}
/*------------------------------------------------- */

function MagazineInput({ placeholder, type = "text", index } : Props1) {
  return (
    <div className="w-full flex space-y-6 px-3 sm:px-6 lg:px-12">
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-[100%] border-0 border-b border-black/40 bg-transparent
            text-[10px] sm:text-[20px] md:text-base lg:text-[20px] font-light outline-none
            placeholder:text-black/30
            focus:border-black/30
            transition-colors duration-200
          `}
        />
        <span
          className={`
            text-[35px] sm:text-[55px] md:text-[60px] lg:text-[85px] font-light 
            text-black/30 shrink-0 leading-none`}
        >
          {String(index).padStart(2, "0")}
        </span>
    </div>
  )
}

export default function Authentification({ onNavigate }: Props) {
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
      sidebar={<Sidebar text="ACCESS" clickable={false} />}
    >
    <div className="flex flex-col h-full "> 
      <TwoColGrid
        left={
          <div className="bg-pink-200 flex flex-col justify-between h-full">
            <div className="pt-16 sm:pt-35 lg:pt-50">
              <MagazineInput placeholder="Pseudo" index={1} />
              <MagazineInput placeholder="Email" index={2} />
              <MagazineInput placeholder="Password" index={3} />
              <MagazineInput placeholder="Confirm password" index={4} />
            </div>

            <button
              onClick={() => onNavigate({ to: "discover", direction: "next" })}
              className={`${typography.buttonAuth} pb-6`}>
              Join →
            </button>
          </div>
        }
        right={
          <div className="bg-pink-300 flex flex-col justify-between h-full">
            <div className="pt-16 sm:pt-35 lg:pt-50">
              <MagazineInput placeholder="Email/username" index={1} />
              <MagazineInput placeholder="Password" index={2} />
            </div>

            <button
              className={`${typography.buttonAuth} pb-6 `}>
              Enter →
            </button>
          </div>
        }
        />
        <FooterLayout>
          <div className="flex items-center">
            <button className={typography.buttonBody}>Forget password →</button>
          </div>
        </FooterLayout>
      </div>
    </BookLayout>
  )
}
