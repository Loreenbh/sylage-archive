"use client"
import { useState, useEffect } from "react"
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
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useProfile } from "@/hooks/useProfile"
import { logout } from "@/lib/services/logout"
import { useFollows } from "@/hooks/useFollows"
import { getFollows, unfollowUser, followUser } from "@/lib/services/follows"

import BackButton from "@/components/ui/buttons/BackButton"
/*------------------------------------------------- */

export default function ProfilePage({ onNavigate, params }: Props) {
  const {
    isOwner,
    userId,
    from
  } = params ?? {}

  const { user: currentUser } = useCurrentUser()

  const [isFollowed, setIsFollowed] = useState(false)


  // Connexions du profil affiché
  const {
    following,
    followers,
    handleUnfollow
  } = useFollows(userId)


  const {
    user: profileUser,
    moodboards,
    silhouettes,
    isLoading
  } = useProfile(userId, isOwner)



  // Vérifie si moi je suis abonné à ce profil
useEffect(() => {
  if (!profileUser || !currentUser) return

  const currentUserId = currentUser.id
  const profileUserId = profileUser.id

  async function checkFollow() {
    const res = await getFollows(currentUserId)

    const followed = res.following.some(
      (user: { id: number }) => user.id === profileUserId
    )

    setIsFollowed(followed)
  }

  checkFollow()

}, [profileUser, currentUser])


  const handleFollowToggle = async () => {
    if (!profileUser) return

    if (isFollowed) {
      await unfollowUser(profileUser.id)
    } else {
      await followUser(profileUser.id)
    }

    setIsFollowed(prev => !prev)
  }



  const handleLogout = async () => {
    try {
      await logout()

      onNavigate?.({
        to: "cover",
        direction: "prev"
      })

    } catch (error) {
      console.error(error)
    }
  }


  const lastMoodboard = moodboards[0] ?? null
  const lastSilhouette = silhouettes[0] ?? null


  const sidebarTitle = "PROFILE"

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
                    to: "inspirations", 
                    direction: "next",
                    params:{
                      isOwner: isOwner,
                    }
                  })
                }
              >
                Inspirations
              </button>

              <div className="justify-end">
                <button
                  className={typography.buttonBody}
                  onClick={handleLogout}
                >
                  Out
                </button>
              </div>
            </>
          ) : (
            <>
              {/* <button
                onClick={() =>{
                  onNavigate?.({
                    to: from ?? "discover",
                    direction: "prev",
                    params: {
                      isOwner: isOwner,
                      from: "profile",
                    },
                  })
                }}
                className={typography.buttonBody}
              >
                back
              </button> */}

              <p className={typography.buttonBody}>
                BY {profileUser?.username}
              </p>

              <span className={typography.bullet}>•</span>

              <button
                onClick={handleFollowToggle}
                className={`
                    ${typography.buttonBody}
                    transition-opacity
                    hover:opacity-60
                    cursor-pointer
                  `}
              >
                {isFollowed ? "unfollow" : "follow"}
              </button>
            </>
          )}
        </div>
      }

      footerLeft={
        <BackButton
          onNavigate={onNavigate}
          backTo={from}
          params={{
            // moodboardId,
            userId,
            isOwner
          }}
        />
      }
      footerRight={
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.2em]">
              {currentUser?.username}
            </span>
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
                  userId: profileUser?.id,
                  from: "profile",
                  isOwner : isOwner, //a modifier
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
              creations
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
                  userId: profileUser?.id,
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
          <div className="bg-zinc-400 h-full w-full flex flex-col">

            <div className="flex-1 min-h-0">
              <ScrollFollow
                followingTitle="Inspired by"
                followersTitle="Inspiring"
                following={following}
                followers={followers}

                onOpenProfile={(item)=>{
                  onNavigate?.({
                    to:"profile",
                    direction:"next",
                    params:{
                      userId:item.id,
                      isOwner:item.id === currentUser?.id,
                      from:"profile"
                    }
                  })
                }}

                onUnfollow={(item)=>{
                  handleUnfollow(item.id)
                }}
              />
            </div>

            <div className="flex items-end p-4 h-12">
              <p className={typography.body}>
                CONNECTIONS
              </p>
            </div>

          </div>
        }
      />
      </div>
    </BookLayout>
  )
}
