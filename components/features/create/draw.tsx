"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import ImageSlot from "../moodboards/ImageSlot"

/* STYLE */
import { typography } from "@/styles/typography"

/* TYPES */
import type { OnNavigate, NavigationParams } from "@/types/navigation"
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/moodboard"
import CurrentUserName from "@/components/ui/pagination/CurrentUsername"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}

/*SERVICES*/
import { uploadImage } from "@/lib/services/upload"
import { createSilhouette } from "@/lib/services/silhouette"

function SilhouetteGhost({ slot }: { slot: MoodboardSlot }) {
  if (!slot) return null

  return (
    <img
      src={slot.url}
      draggable={false}
      style={{
        transform: `
          translate(${slot.offsetX}px, ${slot.offsetY}px)
          scale(${slot.scale})
        `,
      }}
      className="
        absolute inset-0 
        w-full h-full 
        object-cover 
        opacity-20 
        pointer-events-none 
        select-none
      "
    />
  )
}


export default function Draw({ onNavigate, params }: Props) {
    const {
    requestedUser,
    moodboard,
    fromTab,
    isOwner
  } = params ?? {}
  const profileUsername = requestedUser ?? null

  // const sidebarTitle =
  //   isOwner
  //     ? "PROPOSE"
  //     : `${profileUsername}|PROPOSE`


  const [silhouette, setSilhouette] = useState<MoodboardSlot>(null)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)


  const handleSelectSlot = () => {
    fileInputRef.current?.click()
  }


  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (!file) return


    const url = URL.createObjectURL(file)

    setSilhouette({
      url,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    })


    e.target.value = ""
  }


  const handleChangeTransform = (
    patch: MoodboardSlotPatch
  ) => {

    setSilhouette(prev =>
      prev
        ? {
            ...prev,
            ...patch
          }
        : prev
    )
  }


  const handlePublish = async () => {

    setPublishError(null)

    if (!silhouette) {
      setPublishError("Ajoute une image avant de publier")
      return
    }

    if (!moodboard) {
      setPublishError("Erreur interne : moodboard introuvable")
      return
    }

    if (!slotRef.current) {
      setPublishError("Erreur interne : silhouette introuvable")
      return
    }

    setIsPublishing(true)

    try {
   slotRef.current.classList.add("export-mode")

    const imageData = await toPng(slotRef.current)

    slotRef.current.classList.remove("export-mode")


    // 1. upload image
    const imageUrl = await uploadImage(imageData)


    // 2. créer silhouette en base
    await createSilhouette(
      imageUrl,
      moodboard.id
    )

      onNavigate?.({
        to: "moodDetails",
        direction: "prev",
        params: {
          requestedUser,
          isOwner,
          moodboard,
          fromTab,
        }
      })

    } catch {
      setPublishError("Erreur réseau")
    } finally {
      setIsPublishing(false)
    }
  }



  return (
    <BookLayout

      header={
        <Header
          items={[
            {
              section:"HOME",
              clickable:true,
              onClick:()=> 
                onNavigate?.({
                  to:"discover",
                  direction:"prev",
                  params:{
                    requestedUser,
                    isOwner:false
                  }
                })
            },

            {
              section:"FILTER",
              clickable:false,
            },

            {
              section:"CREATE",
              clickable:true,
              onClick:()=>console.log("create")
            }
          ]}
        />
      }


      sidebar={
        <Sidebar
          text={"PROPOSE"}
          clickable={false}
        />
      }


      actionsBar={
        <div className="flex items-center gap-5">

          <button
            onClick={() =>
              onNavigate?.({
                to:"moodDetails",
                direction:"prev",
                params:{
                  requestedUser,
                  isOwner,
                  moodboard,
                  fromTab,
                }
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>


          {!isOwner && (
            <>
              <span className={typography.bullet}>
                •
              </span>


              <button
                onClick={() =>
                  onNavigate?.({
                    to:"profile",
                    direction:"next",
                    params:{
                      requestedUser,
                      isOwner
                    }
                  })
                }
                className={typography.buttonBody}
              >
                profile
              </button>
            </>
          )}



          <div className="ml-[200px] flex items-center gap-3">

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`${typography.buttonBody} disabled:opacity-40`}
            >
              Publish
            </button>

            {publishError && (
              <p className="text-[10px] text-red-600 tracking-[0.1em]">
                {publishError}
              </p>
            )}

          </div>


        </div>
      }

      footer={
          <div className="flex items-center gap-4">
            <CurrentUserName />
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >   


      <div className="
        flex 
        items-stretch 
        w-full 
        h-full 
        gap-1
      ">


        <div className="
          relative 
          overflow-hidden 
          flex-1
        ">
          <SilhouetteGhost
            slot={silhouette}
          />
        </div>



        <div ref={slotRef} className="
          relative 
          overflow-hidden 
          flex-1
        ">

          <ImageSlot

            slot={silhouette}

            onSelect={handleSelectSlot}

            onChangeTransform={
              handleChangeTransform
            }

            className="bg-zinc-100"

          />

        </div>



        <div className="
          relative 
          overflow-hidden 
          flex-1
        ">
          <SilhouetteGhost
            slot={silhouette}
          />
        </div>


      </div>



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