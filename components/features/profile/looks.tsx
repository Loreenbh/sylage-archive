"use client"
import { useEffect, useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ThreeColGrid from "@/components/ui/grids/ThreeColGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import CarouselControls from "@/components/ui/navigation/CarouselControls"
import ContentOverlay from "@/components/ui/cards/ContentOverlay"

/* TYPES */
import { Silhouette } from "@/types/silhouette"


import { useCurrentUser } from "@/hooks/useCurrentUser"
import BackButton from "@/components/ui/buttons/BackButton"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  onBack?: () => void
}

/* HOOKS */
import { useSilhouettes } from "@/hooks/useSilhouettes"
import { typography } from "@/styles/typography"

export default function Looks({ onNavigate, onBack, params }: Props) {
  const {
    userId,
    isOwner,
    moodboardId,
    // from
  } = params ?? {}
  const {
    silhouettes,
    isLoading,
    user: profileUser,
    setSilhouettes,
  } = useSilhouettes(userId, moodboardId)
  
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const { user: currentUser } = useCurrentUser()
  
  const carouselLabel =
  isOwner
    ? `BY ${currentUser?.username}`
    : moodboardId
      ? `FOR ${profileUser?.username}`
      : `BY ${profileUser?.username}`


      
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
      
      const currentItem = Math.min(
        index + 3,
        filteredSilhouettes.length
      )
      
      const handleNext = () => {
        setIndex((i) =>
          Math.min(i + 3, Math.max(filteredSilhouettes.length - 3, 0))
      )
    }
    
    const canPrev = index > 0
    
    const canNext =
    index + 3 < filteredSilhouettes.length
    
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
    
   const renderCell = (silhouette?: Silhouette) => {

  if (!silhouette) {
    return (
      <div className="relative h-full w-full bg-zinc-100 overflow-hidden" />
    )
  }

  const canDelete = silhouette.user_id === currentUser?.id

  return (
    <div className="relative h-full w-full bg-zinc-100 overflow-hidden">

      <img
        src={silhouette.image_url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      <ContentOverlay
        username={
          moodboardId
            ? silhouette.username
            : silhouette.target_username
        }

        prefix={
          moodboardId
            ? "BY"
            : "FOR"
        }

        isOwner={canDelete}

        like={{
          type: "silhouette",
          id: silhouette.id,
          count: silhouette.likes_count,
          liked: silhouette.liked_by_current_user
        }}

        onDelete={
          canDelete
            ? () => handleDelete(silhouette.id)
            : undefined
        }
      />

    </div>
  )
}

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
      sidebar={<Sidebar text="LOOKS" clickable={false} />}
      actionsBar={
        <div className="flex items-center justify-between w-full">

          <span className={typography.buttonBody}>
            {carouselLabel}
          </span>

          <span className={typography.buttonBody}>
            {String(currentItem).padStart(2, "0")} / {String(filteredSilhouettes.length).padStart(2, "0")}
          </span>

          <CarouselControls
            onPrev={handlePrev}
            onNext={handleNext}
            canPrev={canPrev}
            canNext={canNext}
          />

        </div>
      }
      footerLeft={ <BackButton onBack={onBack} /> }
      footerRight={
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
            ...
          </p>
        </div>
      ) : filteredSilhouettes.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-black/30 text-xs tracking-[0.2em]">
            NO LOOKS
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