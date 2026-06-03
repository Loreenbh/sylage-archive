import FormatPage from "@/components/FormatPage"
import { Bodoni_Moda } from "next/font/google"
import Image from "next/image"

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
})


export default function Home() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">

      {/* BACKGROUND BLUR */}
      {/* <div className="absolute inset-0 bg-gray-300 blur-3xl opacity-50 scale-110" /> */}

      <FormatPage >

        {/* BACKGROUND IMAGE */}
          <Image
            src="/globe.svg"
            alt="cover background"
            // fill
            width={300}
            height={400}
            className="object-cover"
          />

        {/* TITLE COVER*/}
          <h1 className={`relative z-10 p-10 text-2xl tracking-[0.6em] 
            uppercase font-light ${bodoni.className} text-black`}>
            THE MOOD ARCHIVE
          </h1>
      </FormatPage>
    </div>
  )
}