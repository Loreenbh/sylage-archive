"use client"
import { useRef, useState, useEffect } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Header from "@/components/navigation/Header"
import Sidebar from "@/components/navigation/SideBar"
import CustomGrid from "@/components/ui/grids/CustomGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import GridButton from "@/components/ui/buttons/GridButton"
import ScrollFollow from "@/components/ui/cards/scrollFollow"
import CurrentUserName from "@/components/ui/pagination/CurrentUsername"
/* STYLE */
import { typography } from "@/styles/typography"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  
}
import { Moodboard } from "@/types/moodboard"
import { Silhouette } from "@/types/silhouettes"

/*------------------------------------------------- */

export default function ProfilePage({ onNavigate, params }: Props) {
  const {
    isOwner,
    requestedUser,
    from
  } = params ?? {}
  const profileUsername = isOwner 
    ? null 
    : requestedUser

  const following = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    user: `user_${String(i + 1).padStart(2, "0")}`,
  }))

  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [silhouettes, setSilhouettes] = useState<Silhouette[]>([])

  useEffect(() => {
  if (!isOwner && !requestedUser) return
    async function loadProfile() {
      try {
        const url = isOwner
          ? "/api/profile"
          : `/api/profile?user=${requestedUser}`

        const res = await fetch(url)
        const data = await res.json()

        setMoodboards(data.moodboards)
        setSilhouettes(data.silhouettes)

      } catch {
        setMoodboards([])
        setSilhouettes([])
      }
    }

    loadProfile()

  }, [isOwner, requestedUser])

  const lastMoodboard = moodboards[0] ?? null
  const lastSilhouette = silhouettes[0] ?? null
  
  const sidebarTitle = 
    isOwner
    ? "PROFILE"
    : profileUsername
      ? `${profileUsername} | PROFILE`
      : "PROFILE"
      
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
              onClick: () => console.log("filter clicked"),
             },
            { section: "CREATE",
              clickable: true,
                onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                  params:{
                    from: "discover",
                    isOwner: isOwner
                  }
                })
             },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2">
          {isOwner === true ? (
            <>
              <button
                className={typography.buttonBody}
                onClick={() =>
                  onNavigate?.({ 
                    to: "settings", 
                    direction: "next",
                    params:{
                      // username,
                      isOwner: isOwner,
                    }
                  })
                }
              >
                Settings
              </button>

              <span className={typography.bullet}>•</span>

              <button
                className={typography.buttonBody}
                onClick={() =>
                  onNavigate?.({ 
                    to: "loves", 
                    direction: "next",
                    params:{
                      // username,
                      isOwner: isOwner,
                    }
                  })
                }
              >
                Loves
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>{
                console.log("DAN PROFILE PAGE FROM=", from)
                  onNavigate?.({
                    to: from ?? "discover",
                    direction: "prev",
                    params: {
                      requestedUser,
                      isOwner: isOwner,
                      from: "profile",
                    },
                  })
                }}
                className={typography.buttonBody}
              >
                back
              </button>
            </>
          )}
        </div>
      }

      footer={
          <div className="flex items-center gap-4">
            <CurrentUserName />
            <ProfileButton onNavigate={onNavigate}/>
          </div>
          }
        >   
    <div className="flex flex-col h-full "> 
      <CustomGrid
        left={
          <GridButton
            className="relative overflow-hidden bg-zinc-200 hover:bg-zinc-300"
            onClick={() => 
              onNavigate?.({ 
                to: "silhouettes", 
                direction: "next",
                params:{
                  requestedUser,
                  from: "profile",
                  isOwner : isOwner,
                }
                 })}>

            {lastSilhouette && (
              <img
                src={lastSilhouette.image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <p className={`${typography.body} relative z-10 ${lastSilhouette ? "text-white drop-shadow" : ""}`}>
              silhouettes
            </p>
          </GridButton>
        }

                topRight={
          <GridButton
            className="relative overflow-hidden bg-zinc-200 hover:bg-zinc-300"
            onClick={() => 
              onNavigate?.({ 
                to:"moods", 
                direction: "next", 
                params:{
                  isOwner: isOwner,
                }, 
              })
            }
          >
            {lastMoodboard && (
              <img
                src={lastMoodboard.image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <p className={`${typography.body} relative z-10 ${lastMoodboard ? "text-white drop-shadow" : ""}`}>
              moods
            </p>
          </GridButton>
        }

        bottomRight={
          <div className="bg-zinc-400 h-full w-full text-left">
            <ScrollFollow
              title="following"
              items={following}
              
            />
              <p className={typography.body}>inspired by</p>
          </div>
        }
      />
      </div>
    </BookLayout>
  )
}
