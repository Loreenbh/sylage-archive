"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/Format/Layout"
import { typography } from "@/styles/typography"
import Header from "@/components/Book/Header"

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] })

function MagazineInput({ placeholder, type = "text", index }) {
  return (
    <div className="mb-8">
      <div className="flex items-end gap-4">
        <input
          type={type}
          placeholder={placeholder}
          className={`
            ${roboto.className}
            flex-1 border-0 border-b border-black/20 bg-transparent
            py-1 text-sm font-light tracking-wide outline-none
            placeholder:text-black/30
            focus:border-black/60
            transition-colors duration-200
          `}
        />
        <span className={`${roboto.className} text-2xl font-light text-black/20 shrink-0 leading-none pb-1`}>
          {String(index).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

export default function Authentification() {
  return (
    <BookLayout
      header={<Header locked />}
      sidebar={
        <div className="flex flex-col items-center h-[450px] gap-35 w-[60px] mt-28">
          <div className="w-px h-[180px] md:h-[120px] lg:h-[350px] bg-black/20" />
          <p className={`${roboto.className} text-4xl font-light -rotate-90 w-[90px] tracking-[0.2em] text-black/60`}>
            ACCESS
          </p>
        </div>
      }
    >
      <div className="flex flex-col w-full max-w-[900px] mt-28">

        {/* GRID FORMULAIRES */}
        <div className="grid grid-cols-2 gap-1 h-[530px]">

          {/* LEFT — JOIN */}
          <div className="flex flex-col justify-between h-full w-full px-10 pt-40 pb-8 bg-pink-200">
            <div>
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
          <div className="flex flex-col justify-between h-full w-full px-10 pt-25 pb-8 bg-pink-200">
            <div>
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
        <div className="px-10 pt-5">
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