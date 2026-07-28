"use client"
import { useEffect, useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ThreeColGrid from "@/components/ui/grids/ThreeColGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import GridPager from "@/components/ui/pagination/GridPager"
import ContentOverlay from "@/components/ui/cards/ContentOverlay"

/* STYLE */
import { typography } from "@/styles/typography"

/* TYPES */
import { Silhouette } from "@/types/silhouette"


import { useCurrentUser } from "@/hooks/useCurrentUser"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}

/* HOOKS */
import { useSilhouettes } from "@/hooks/useSilhouettes"

export default function Silhouettes({ onNavigate, params }: Props) {

    const {
    userId,
    isOwner,
    moodboardId,
    from
  } = params ?? {}
  const {
    silhouettes,
    isLoading,
    user: profileUser,
    setSilhouettes,
  } = useSilhouettes(userId, moodboardId)

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const { user: currentUser } = useCurrentUser()

  const sidebarTitle =
    isOwner
      ? "MY SILHOUETTES"
      : moodboardId
        ? profileUser?.username
          ? `${profileUser.username} | LOOKS`
          : "LOOKS"
        : profileUser?.username
          ? `${profileUser.username} | SILHOUETTES`
          : "SILHOUETTES"

  const filteredSilhouettes =
    moodboardId || selectedFilters.length === 0
      ? silhouettes
      : silhouettes.filter((silhouette) =>
          silhouette.tags?.some(tag =>
            selectedFilters.includes(tag)
          )
        )


  const [index, setIndex] = useState(0)
  const left = filteredSilhouettes[index]
  const center = filteredSilhouettes[index + 1]
  const right = filteredSilhouettes[index + 2]



  const handleNext = () => {
    setIndex((i) =>
      Math.min(i + 3, Math.max(filteredSilhouettes.length - 3, 0))
    )
  }

  const handlePrev = () => {
    setIndex((i) => Math.max(i - 3, 0))
  }

  const handleDelete = async (id:number) => {

    const res = await fetch(`/api/silhouettes?id=${id}`, {
      method:"DELETE"
    })

    if(res.ok){
      setSilhouettes(prev =>
        prev.filter(s => s.id !== id)
      )
    }
  }

const renderCell = (silhouette?: Silhouette) => (
  <div className="relative h-full w-full bg-zinc-100 overflow-hidden">

    {silhouette && (
      <>
        <img
          src={silhouette.image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <ContentOverlay
          username={silhouette.username}
          isOwner={silhouette.user_id === currentUser?.id}
          onOpenProfile={() =>
            onNavigate?.({
              to: "profile",
              direction: "next",
              params: {
                userId: silhouette.user_id,
                isOwner: silhouette.user_id === currentUser?.id,
                from: "silhouettes"
              }
            })
          }
          like={{
            type:"silhouette",
            id:silhouette.id,
            count:silhouette.likes_count,
            liked:silhouette.liked_by_current_user
          }}
          onDelete={() => handleDelete(silhouette.id)}
        />   
      </>
    )}

  </div>
)

  return (
    <BookLayout
      header={
        <Header
          onFiltersChange={setSelectedFilters}
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
            {
              section: "FILTER",
              clickable: !moodboardId,
            },
            { section: "CREATE",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                  params:{
                    from: "discover",
                  }
                }),
             },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              onNavigate?.({
                to: "profile",
                direction: "prev",
                params:{
                  
                  userId,
                  isOwner,
                  from: "moodDetails",
                  // moodboard
                }
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>

          <GridPager
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      }
      footer={
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.2em]">
              {currentUser?.username}
            </span>
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >   
      <div className="flex flex-col h-full min-h-0 gap-1">

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-black/30 text-xs tracking-[0.2em]">
            CHARGEMENT...
          </p>
        </div>
      ) : filteredSilhouettes.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-black/30 text-xs tracking-[0.2em]">
            AUCUNE SILHOUETTE POUR L'INSTANT
          </p>
        </div>
      ) : (
        <ThreeColGrid
          left={renderCell(left)}
          center={renderCell(center)}
          right={renderCell(right)}
        />
      )}

      </div>
    </BookLayout>
  )
}