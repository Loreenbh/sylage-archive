"use client"
import { useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import SimpleGrid from "@/components/ui/grids/SimpleGrid"
import LikeButton from "@/components/ui/buttons/LikeButton"
import { useCurrentUser } from "@/hooks/useCurrentUser"

/* STYLE */
import { typography} from "@/styles/typography"
import { useMoodboard } from "@/hooks/useMoodboard"
import BackButton from "@/components/ui/buttons/BackButton"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  onBack?: () => void

}


export default function MoodDetails({ onNavigate, params, onBack }: Props) {
  const { user } = useCurrentUser()
  const {
    isOwner,
    from,
    moodboardId,
  } = params ?? {}

  const {
    moodboard,
    isLoading
  } = useMoodboard(moodboardId)

  const sidebarTitle = "MOODBOARD"
  
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
                    isOwner: false
                  }
                })
            },
            { section: "FILTER",
              clickable: false,
             },
            { section: "CREATE",
              clickable: true,
                onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                  params:{
                    from: "discover",
                    isOwner
                  }
                })
             },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-[60px]">
          {!isOwner && (
            <>
              <button
                onClick={() =>
                  onNavigate?.({
                    to: "profile",
                    direction: "next",
                    params: {
                      isOwner,
                      from: "moodDetails",
                      userId:moodboard?.user_id,
                    },
                  })
                }
                  className={`
                    ${typography.buttonBody}
                    transition-opacity
                    hover:opacity-60
                    cursor-pointer
                  `}
              >
                by {moodboard?.username}
              </button>

            <div className="">
              <button
                onClick={() =>
                  onNavigate?.({
                    to: "draw",
                    direction: "next",
                    params: {
                      moodboardId : moodboard?.id,
                      // userId: moodboard?.user_id,
                      // isOwner,
                    },
                  })
                }
                className={typography.buttonBody}
              >
                Propose
              </button>
              
            </div>
            </>
          )}

          {moodboard && (
            <LikeButton
              type="moodboard"
              className={typography.buttonBody}
              id={moodboard.id}
              initialCount={moodboard.likes_count}
              initialLiked={moodboard.liked_by_current_user}
              disabled={false}
            />
          )}
            <button
              onClick={() =>
                onNavigate?.({
                  to: "looks",
                  direction: "next",
                  params: {
                    isOwner,
                    moodboardId: moodboard?.id,
                    from: "moodDetails",
                  },
                })
              }
              className={typography.buttonBody}
            >
              looks
            </button>
        </div>               
      }
      footerLeft={
        <BackButton onBack={onBack} />
      }
      footerRight={
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.2em]">
              {user?.username}
            </span>
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >     
      <div className="flex flex-col h-full min-h-0 gap-1">

      <SimpleGrid
        square={
            <div className="relative w-[280px] sm:w-[500px] md:w-[550px] lg:w-[750px] aspect-square mx-auto bg-red-200">
                {moodboard && (
                  <img
                    src={moodboard.image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
            </div>
          }
        />

      </div>
    </BookLayout>
  )
}
