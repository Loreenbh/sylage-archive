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
/* STYLE */
import { typography } from "@/styles/typography"
/* TYPES */
import CurrentUserName from "@/components/ui/pagination/CurrentUserName"
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  
}

type LastMoodboard = {
  image_url : string
}

type LastSilhouette = {
  image_url : string
}
/*------------------------------------------------- */

export default function ProfilePage({ onNavigate, params }: Props) {
  const {
    currentUser,
    requestedUser
  } = params ?? {}
  const profileUsername = requestedUser ?? currentUser

  const following = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    user: `user_${String(i + 1).padStart(2, "0")}`,
  }))

const { isOwner: mode, from, moodboard} = params ?? {}

const [lastMoodboard, setLastMoodboard] = useState<LastMoodboard | null>(null)
const [lastSilhouette, setLastSilhouette] = useState<LastSilhouette | null>(null)
  useEffect(() => {
    // if (!username) return
    console.log("PROFIL PAGE", profileUsername)
    console.log("PROFILE moodboard =", moodboard)
    async function loadLastMoodboard() {
      try {
        const res = await fetch(`/api/moodboards?user=${profileUsername}`)
        const data = await res.json()
        // l'API renvoie déjà triée par created_at DESC → le premier est le plus récent
        setLastMoodboard(data[0] ?? null)
      } catch {
        setLastMoodboard(null)
      }
    }

       async function loadLastSilhouette() {
      try {
        const res = await fetch(`/api/silhouettes?user=${profileUsername}`)
        const data = await res.json()
        setLastSilhouette(data[0] ?? null)
      } catch {
        setLastSilhouette(null)
      }
    }

    loadLastMoodboard()
    loadLastSilhouette()
  }, [profileUsername])


  
  const sidebarTitle = 
    mode
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
                    currentUser,
                    requestedUser,
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
                    // user,
                    from: "discover",
                    isOwner: mode
                  }
                })
             },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2">
          {mode === true ? (
            <>
              <button
                className={typography.buttonBody}
                onClick={() =>
                  onNavigate?.({ 
                    to: "settings", 
                    direction: "next",
                    params:{
                      // username,
                      isOwner: mode,
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
                      isOwner: mode,
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
                      currentUser,
                      requestedUser,
                      isOwner: mode,
                      from: "profile",
                      moodboard
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
            <ProfileButton onNavigate={onNavigate} currentUser={currentUser}/>
          </div>
          }
        >   
    <div className="flex flex-col h-full "> 
      <CustomGrid
        left={
          <GridButton
            className="bg-zinc-200 hover:bg-zinc-300"
            onClick={() => 
              onNavigate?.({ 
                to: "silhouettes", 
                direction: "next",
                params:{
                  currentUser,
                  requestedUser,
                  from: "profile",
                  isOwner : mode,
                  moodboard
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
                  currentUser,
                  requestedUser,
                  isOwner: mode,
                  moodboard
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
