"use client"
import { useState, useRef } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/moodboard"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import ImageSlot from "../moodboards/ImageSlot"

/* STYLE */
import { typography} from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}


function SilhouetteGhost({slot} : {slot: MoodboardSlot}){
    if (!slot) return null
    return (
        <img
        src={slot.url}
        draggable={false}
      style={{
        transform: `translate(${slot.offsetX}px, ${slot.offsetY}px) scale(${slot.scale})`,
      }}
      className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
    />
    )
}



export default function Draw({ onNavigate, params }: Props) {
const { isOwner: mode, user, fromTab, from} = params ?? {}
  const sidebarTitle = 
    mode === true
    ? "PROPOSE"
    : ` ${user}|PROPOSE`

    const [silhouette, setSilhouette] = useState<MoodboardSlot>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleSelectSlot = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setSilhouette({ url, scale: 1, offsetX: 0, offsetY: 0 })

    // permet re-upload même fichier
    e.target.value = ""
  }

  const handleChangeTransform = (patch: MoodboardSlotPatch) => {
    setSilhouette((prev) => (prev ? { ...prev, ...patch } : prev))
  }
  
  console.log("dans mooddetails mode est:", mode)
  return (
    <BookLayout
      header={
        <Header
          items={[
            { section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "discover",
                  direction: "prev",
                  params:{
                    user,
                    isOwner: false
                  }
                })
            },
            { section: "FILTER",
              clickable: false,
              onClick: () => console.log("filter clicked"),
             },
            { section: "CREATE",
              clickable: true,
              onClick: () => console.log("create clicked"),
             },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-5">
          
          {/* BACK toujours visible */}
          <button
            onClick={() =>
              onNavigate?.({
                to: "moodDetails",
                direction: "prev",
                params: {
                  user,
                  isOwner: mode,
                  fromTab,
                },
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>

          {mode === false && (
            <>
              <span className={typography.bullet}>•</span>

              <button
                onClick={() =>
                  onNavigate?.({
                    to: "profile",
                    direction: "next",
                    params: {
                      user,
                      isOwner: mode
                    },
                  })
                }
                className={typography.buttonBody}
              >
                profile
              </button>
            </>
          )}

          {mode === false && (
            <div className="ml-[200px]">
              <button
                onClick={handlePublish}
                // onClick={() =>
                //   onNavigate?.({
                //     to: "profile",
                //     direction: "next",
                //     params: {
                //       user,
                //       isOwner: mode
                //     },
                //   })
                // }
                className={typography.buttonBody}
              >
                Publish
              </button>
              
            </div>
          )}
        </div>
      }
      footer={
        <ProfileButton onNavigate={onNavigate} />
      }
    >
      {/* 3 colonnes flex-1 : chacune prend 1/3 de la largeur disponible,
          hauteur fixe par breakpoint (le flex étire automatiquement) */}
      <div className="flex items-stretch w-full h-full gap-1">

        <div className="relative overflow-hidden flex-1">
          <SilhouetteGhost slot={silhouette} />
        </div>

        <div className="relative overflow-hidden flex-1">
          <ImageSlot
            slot={silhouette}
            onSelect={handleSelectSlot}
            onChangeTransform={handleChangeTransform}
            className="bg-zinc-100"
          />
        </div>

        <div className="relative overflow-hidden flex-1">
          <SilhouetteGhost slot={silhouette} />
        </div>

      </div>

      {/* INPUT FILE HIDDEN */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </BookLayout>
  )
}