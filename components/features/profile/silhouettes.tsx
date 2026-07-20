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
import CurrentUserName from "@/components/ui/pagination/CurrentUsername"
import LikeButton from "@/components/ui/buttons/LikeButton"
import ContentOverlay from "@/components/ui/cards/ContentOverlay"

/* STYLE */
import { typography } from "@/styles/typography"

/* TYPES */
import { Silhouette } from "@/types/silhouettes"
import { getSilhouetteData } from "@/lib/services/silhouette"
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}


export default function Silhouettes({ onNavigate, params }: Props) {

    const {
    requestedUser,
    isOwner,
    moodboard,
    from
  } = params ?? {}

  console.log(moodboard)
  const profileUsername = isOwner 
    ? null 
    : requestedUser

  const [silhouettes, setSilhouettes] = useState<Silhouette[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [index, setIndex] = useState(0)

useEffect(() => {

  let cancelled = false

  async function loadSilhouettes() {
    setIsLoading(true)

    try {

      const data = await getSilhouetteData(profileUsername ?? undefined, moodboard?.id)

      if (!cancelled) {
        setSilhouettes(data)
      }

    } catch {

      if (!cancelled) {
        setSilhouettes([])
      }

    } finally {

      if (!cancelled) {
        setIsLoading(false)
      }

    }
  }

  loadSilhouettes()

  return () => {
    cancelled = true
  }

}, [profileUsername])


  const left = silhouettes[index]
  const center = silhouettes[index + 1]
  const right = silhouettes[index + 2]

  const handlePrev = () => {
    setIndex((i) => Math.max(i - 1, 0))
  }

  const handleNext = () => {
    setIndex((i) => Math.min(i + 1, Math.max(silhouettes.length - 3, 0)))
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


  const sidebarTitle =
    isOwner
      ? "SILHOUETTES"
      : profileUsername
        ? `${profileUsername} | SILHOUETTES`
        : "SILHOUETTES"

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
          isOwner={isOwner ?? false}
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
          items={[
            { section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "discover",
                  direction: "prev",
                  params:{
                    requestedUser,
                    isOwner: false
                  }
                })
            },
            { section: "FILTER",
              clickable: true,
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
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              onNavigate?.({
                to: "profile",
                direction: "prev",
                params:{
                  
                  requestedUser,
                  isOwner,
                  from: "moodDetails",
                  moodboard
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
            <CurrentUserName />
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
      ) : silhouettes.length === 0 ? (
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