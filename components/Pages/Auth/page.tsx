"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/layout/Layout"
import Sidebar from "@/components/layout/SideBar"
import TwoColGrid from "@/components/ui/Grid/TwoColGrid"
import Header from "@/components/layout/Header"

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] })

function MagazineInput({ placeholder, type = "text", index }) {
  return (
    <div className="bg-red-300 w-full px-2 sm:px-4">
      <div className="flex">
        <input
          type={type}
          placeholder={placeholder}
          className={`
            ${roboto.className}
            w-[90%] border-0 border-b border-black/20 bg-transparent
            text-xs sm:text-sm md:text-base font-light outline-none
            placeholder:text-black/30
            focus:border-black/60
            transition-colors duration-200
          `}
        />
        <span
          className={`${roboto.className} 
            text-xs sm:text-2xl md:text-3xl font-light 
            text-black/20 shrink-0 leading-none`}
        >
          {String(index).padStart(2, "0")}
        </span>
      </div>
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
      sidebar={<Sidebar text="ACCESS" clickable={false} />}
    >
      <TwoColGrid
        left={
          <div className="bg-pink-200 flex flex-col justify-between px-2 sm:px-4 md:px-6 pb-2 sm:pb-3 md:pb-4 h-full">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mt-3 sm:mt-4 md:mt-6">
              <MagazineInput placeholder="Pseudo" index={1} />
              <MagazineInput placeholder="Email" index={2} />
              <MagazineInput placeholder="Password" index={3} />
              <MagazineInput placeholder="Confirm password" index={4} />
            </div>

            <button
              onClick={() => onNavigate({ to: "discover", direction: "next" })}
              className={`${roboto.className} text-xs sm:text-sm md:text-base tracking-[0.50em] uppercase text-black/50 hover:text-black transition-colors`}
            >
              Join →
            </button>
          </div>
        }
        right={
          <div className="bg-pink-300 flex flex-col justify-between px-2 sm:px-4 md:px-6 pb-2 sm:pb-3 md:pb-4 h-full">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 mt-3 sm:mt-4 md:mt-6">
              <MagazineInput placeholder="Email or username" index={1} />
              <MagazineInput placeholder="Password" index={2} />
            </div>

            <button
              className={`${roboto.className} text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase text-black/50 hover:text-black transition-colors`}
            >
              Enter →
            </button>
          </div>
        }
        footer={
          <p className="text-[10px] sm:text-xs md:text-sm text-black/30 hover:text-black/60 cursor-pointer transition-colors">
            Forgot password →
          </p>
        }
      />
    </BookLayout>
  )
}