"use client"
import { useState } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import SimpleGrid from "@/components/ui/grids/SimpleGrid"

/* STYLE */
import { typography} from "@/styles/typography"

type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
}

export default function MoodDetails({ onNavigate, params }: Props) {

const { isOwner: mode, user, fromTab, from, moodboard} = params ?? {}
  const sidebarTitle = 
    mode === true
    ? "DETAILS"
    : ` ${user}|DETAILS`
  
  console.log("dans mooddetails mode est:", mode)
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
                    user,
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
              onClick: () => console.log("create clicked"),
             },
          ]}
        />
      }
      sidebar={<Sidebar text={sidebarTitle} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-5">
          
          {/* BACK toujours visible */}
          <button
            onClick={() =>
              onNavigate?.({
                to: from === "moods" ? "moods" : "discover",
                direction: "prev",
                params: {
                  user,
                  isOwner: mode,
                  fromTab,
                },
              })
            }
            className={typography.buttonBody}
          >
            back
          </button>

          {mode === false && (
            <>
              <span className={typography.bullet}>•</span>

              <button
                onClick={() =>
                  onNavigate?.({
                    to: "profile",
                    direction: "next",
                    params: {
                      user,
                      isOwner: mode
                    },
                  })
                }
                className={typography.buttonBody}
              >
                profile
              </button>
            </>
          )}

          {mode === false && (
            <div className="ml-[200px]">
              <button
                onClick={() =>
                  onNavigate?.({
                    to: "draw",
                    direction: "next",
                    params: {
                      user,
                      isOwner: mode
                    },
                  })
                }
                className={typography.buttonBody}
              >
                Propose
              </button>
              
            </div>
          )}
        </div>
      }
      footer={
        <ProfileButton onNavigate={onNavigate} />
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
