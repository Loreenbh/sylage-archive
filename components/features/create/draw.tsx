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
import CurrentUserName from "@/components/ui/pagination/CurrentUserName"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}


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
    currentUser,
    requestedUser
  } = params ?? {}
  const profileUsername = requestedUser ?? currentUser
  const {
    isOwner: mode,
    fromTab,
    moodboard
  } = params ?? {}


  const sidebarTitle =
    mode === true
      ? "PROPOSE"
      : `${profileUsername}|PROPOSE`


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
      slotRef.current.classList.add("export-mode")      // 1. capture le rendu affiché (avec le zoom/déplacement appliqué) en PNG
      const imageData = await toPng(slotRef.current)
      slotRef.current.classList.remove("export-mode")      // 2. upload cette image, récupère son URL réelle
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        setPublishError(uploadData.error ?? "Erreur lors de l'upload")
        return
      }

      // 3. crée la silhouette avec cette URL réelle, liée au moodboard
      const res = await fetch("/api/silhouettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          moodboardId: moodboard.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setPublishError(data.error ?? "Erreur lors de la publication")
        return
      }

      onNavigate?.({
        to: "moodDetails",
        direction: "prev",
        params: {
          currentUser,
          requestedUser,
          isOwner: mode,
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
                    currentUser,
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
          text={sidebarTitle}
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
                  currentUser,
                  requestedUser,
                  isOwner:mode,
                  moodboard,
                  fromTab,
                }
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>


          {mode === false && (
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
                      currentUser,
                      requestedUser,
                      isOwner:mode
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
            <ProfileButton onNavigate={onNavigate} currentUser={currentUser}/>
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