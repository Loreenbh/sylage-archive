"use client"

import { useRef, useState } from "react"

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
    isOwner: mode,
    username,
    fromTab,
    moodboard
  } = params ?? {}


  const sidebarTitle =
    mode === true
      ? "PROPOSE"
      : `${username}|PROPOSE`


  const [silhouette, setSilhouette] = useState<MoodboardSlot>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)


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

    if (!silhouette) {
      console.log("aucune silhouette")
      return
    }


    if (!moodboard) {
      console.log("aucun moodboard")
      return
    }


    try {

      const res = await fetch("/api/silhouettes", {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          imageUrl: silhouette.url,
          moodboardId: moodboard.id,
        })
      })


      const data = await res.json()


      if (!res.ok) {
        console.error(data.error)
        return
      }


      console.log(
        "silhouette créée",
        data
      )


      onNavigate?.({
        to:"moodDetails",
        direction:"prev",
        params:{
          username,
          isOwner:mode,
          moodboard,
          fromTab,
        }
      })


    } catch(err){

      console.error(
        "Erreur sauvegarde silhouette",
        err
      )

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
                    username,
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
                  username,
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
                      username,
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



          <div className="ml-[200px]">

            <button
              onClick={handlePublish}
              className={typography.buttonBody}
            >
              Publish
            </button>

          </div>


        </div>
      }


      footer={
        <ProfileButton
          onNavigate={onNavigate}
        />
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



        <div className="
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