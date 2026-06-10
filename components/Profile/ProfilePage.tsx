"use client"
import { Roboto } from "next/font/google"
import BookLayout from "@/components/Format/Layout"
import Header from "@/components/Book/Header"
import { typography } from "@/styles/typography"


const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400"] })

export default function ProfilePage({ onNavigate }) {

  const isSelf = true

  return (
    <BookLayout
      header={<Header active="HOME" />}
      sidebar={
        <div className="flex flex-col items-center h-[630px] gap-25 w-[60px]">
          <div className="w-px h-[180px] bg-black/20" />
          <p className="text-4xl font-light -rotate-90 text-black/60">
            access
          </p>
        </div>
      }
    >

      {/* MAIN WRAPPER */}
      <div className="flex flex-col h-full">

        {/* GRID */}
        <div className="grid grid-cols-2 gap-2 flex-1">

          <div className="bg-zinc-200 flex items-end p-4">
            <p className="text-xs tracking-[0.2em] text-black/50">
              MY MOODBOARD
            </p>
          </div>

          <div className="grid grid-rows-2 gap-2">

            <div className="bg-zinc-300 flex items-end p-4">
              <p className="text-xs tracking-[0.2em] text-black/50">
                SAVED
              </p>
            </div>

            <div className="bg-zinc-400 flex items-end p-4">
              <p className="text-xs tracking-[0.2em] text-black/50">
                LIKED
              </p>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-2 pt-4 pb-2">

          {/* LEFT */}
          <div className="flex items-center gap-6">
            <button className="text-[10px] tracking-[0.35em] uppercase text-black/60">
              Settings
            </button>

            <span className="text-black/20 text-[10px]">•</span>

            <button className="text-[10px] tracking-[0.35em] uppercase text-black/60">
              Loves
            </button>
          </div>

          {/* RIGHT */}
          <div className="w-12 h-12 rounded-full bg-zinc-300" />

        </div>

      </div>

    </BookLayout>
  )
}



  /* {isSelf ? (
          <button>Edit profile</button>
        ) : (
          <button onClick={() => alert("follow")}>
            Follow
          </button>
        )}
      </div> */


    //   {/* NAVIGATION EXEMPLE */}
    //   {!isSelf && (
    //     <button
    //       onClick={() =>
    //         onNavigate({
    //           to: "discover",
    //           direction: "next",
    //         })
    //       }
    //     >
    //       Go discover →
    //     </button>
    //   )}

    // </div>