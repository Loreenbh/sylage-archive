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
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  
}

/*------------------------------------------------- */

export default function ProfilePage({ onNavigate, params }: Props) {
  const following = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    user: `user_${String(i + 1).padStart(2, "0")}`,
  }))
  // const user = params?.user
  // const mode = params?.isOwner
const { isOwner: mode, user} = params ?? {}

  const sidebarTitle = 
    mode
    ? "PROFILE"
    : user
      ? `${user} | PROFILE`
      : "PROFILE"
  console.log("dans profilepage mode est:", mode)
  return (
    <BookLayout
      header={
        <Header
          items={[
            { section: "HOME" },
            { section: "FILTER" },
            { section: "CREATE" },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2">
          {mode === true && (
            <>
              <button
                className={typography.buttonBody}
                onClick={() =>
                  onNavigate?.({ 
                    to: "settings", 
                    direction: "next",
                    params:{
                      user,
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
                      user,
                      isOwner: mode,
                    }
                  })
                }
              >
                Loves
              </button>
            </>
          )}
        </div>
      }

      footer={
        <ProfileButton onNavigate={onNavigate} />
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
                  user,
                  from: "silhouettes",
                  isOwner : mode
                }
                 })}>
            <p className={typography.body}>silhouettes</p>
          </GridButton>
        }

        topRight={
          <GridButton
            className="bg-zinc-200 hover:bg-zinc-300"
            onClick={() => 
              onNavigate?.({ 
                to:"moods", 
                direction: "next", 
                params:{
                  user,
                  isOwner: mode,
                }, 
              })
            }
          >
            <p className={typography.body}>moods</p>
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



