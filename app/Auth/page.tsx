"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/Format/Layout"
import { typography } from "@/styles/typography"
import Header from "@/components/Book/Header"

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] })

function MagazineInput({ placeholder, type = "text", index }) {
  return (
    <div className="w-full px-4">
      <div className="flex items-end">
        <input
          type={type}
          placeholder={placeholder}
          className={`
            ${roboto.className}
            flex-1 border-0 border-b border-black/20 bg-transparent
            mt-10
            text-x font-light tracking-wide outline-none
            placeholder:text-black/30
            focus:border-black/60
            transition-colors duration-200
          `}
        />
        <span className={`${roboto.className} text-6xl font-light text-black/20 shrink-0 leading-none`}>
          {String(index).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

export default function Authentification() {
  return (
    <BookLayout
      header={
        <p>test</p>
      }
      sidebar={
        <div className="flex flex-col items-center h-[630px] gap-25 w-[60px]">
          <div className="w-px h-[180px] md:h-[120px] lg:h-[350px] bg-black/20" />
          <p className={`${roboto.className} text-4xl font-light -rotate-90 w-[90px] tracking-[0.2em] text-black/60`}>
          access 
          </p>
        </div>
      }
    >

      <div className="flex flex-col">

        {/* GRID FORMULAIRES */}
        <div className="grid grid-cols-2 gap-2 h-[400px] md:h-[530px] lg:h-[700px]">

          {/* LEFT — JOIN */}
          <div className="flex flex-col justify-between px-8 pb-7 h-full bg-pink-300 m">
            <div className="space-y-4 mt-30">
              <MagazineInput placeholder="Pseudo" index={1} />
              <MagazineInput placeholder="Email" type="email" index={2} />
              <MagazineInput placeholder="Password" type="password" index={3} />
              <MagazineInput placeholder="Confirm password" type="password" index={4} />
            </div>
            <button
              className={`
                ${roboto.className}
                self-start text-xl tracking-[0.50em] font-light uppercase
                text-black/50 hover:text-black
                transition-colors duration-300
              `}
            >
              Join →
            </button>
          </div>

          {/* RIGHT — CONNECT */}
          <div className="flex flex-col justify-between px-8 pt-25 pb-7 bg-pink-400 h-full">
            <div className="space-y-4 mt-30">
              <MagazineInput placeholder="Email or username" index={1} />
              <MagazineInput placeholder="Password" type="password" index={2} />
            </div>
            <button
              className={`
                ${roboto.className}
                self-start text-xl tracking-[0.35em] font-light uppercase
                text-black/50 hover:text-black
                transition-colors duration-300
              `}
            >
              Enter →
            </button>
          </div>

        </div>

        {/* FORGOT PASSWORD */}
        <div className="px-20 pt-5">
          <p
            className={`
              ${typography.texte}
              cursor-pointer
              text-black/30 hover:text-black/60
              transition-colors duration-300
              group relative w-fit
            `}
          >
            Forgot password →
          </p>
        </div>

      </div>
    </BookLayout>
  )
}