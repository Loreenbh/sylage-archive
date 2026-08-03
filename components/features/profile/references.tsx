"use client"
import type { OnNavigate } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import LovesGrid from "@/components/ui/grids/LovesGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import BackButton from "@/components/ui/buttons/BackButton"
import { NavigationParams } from "@/types/navigation"
import { useReferences } from "@/hooks/useReferences"
/* STYLE */
import { typography } from "@/styles/typography"

type Props = {
  params?: NavigationParams["params"] | null
  onNavigate: OnNavigate
  onBack?: () => void
}

export default function References({ onNavigate, onBack, params }: Props) {
  const { user: currentUser } = useCurrentUser()
  const { isOwner, userId, from } = params ?? {}
  const { references, isLoading } = useReferences() 
  
  const latestLooks = references?.looks?.slice(0, 3)
  const latestMoods = references?.moods?.slice(0, 3)
  const featuredCreator = references?.muse

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
                }),
             },
          ]}
        />
      }
      sidebar={<Sidebar text="REFERENCES" clickable={false} />}
      actionsBar={
        <div className="flex w-full items-center justify-between">
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
        <LovesGrid
          left={
            <button
              onClick={() =>
                onNavigate?.({
                  to:"looks",
                  direction:"next",
                  params:{
                    from:"references",
                    isOwner:true
                  }
                })
              }
              className="
                relative
                h-full
                w-full
                overflow-hidden
                bg-zinc-200
                text-left
              "
            >

              {latestLooks?.[0] && (
                <img
                  src={latestLooks[0].image_url}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                  "
                />
              )}

              <div className="
                absolute
                bottom-0
                left-0
                p-4
                text-white
              ">
                <p className={typography.buttonBody}>
                  LOOKS
                </p>

                <p className="
                  text-[10px]
                  tracking-[0.2em]
                  text-white/70
                ">
                  LIKED SILHOUETTES
                </p>
              </div>

            </button>
          }
          topRight={
            <button
              onClick={() =>
                onNavigate?.({
                  to:"moods",
                  direction:"next",
                  params:{
                    from:"references",
                    isOwner:true
                  }
                })
              }
              className="
                relative
                h-full
                w-full
                overflow-hidden
                bg-zinc-300
                text-left
              "
            >

              {latestMoods?.[0] && (
                <img
                  src={latestMoods[0].image_url}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                  "
                />
              )}

              <div className="
                absolute
                bottom-0
                left-0
                p-4
                text-white
              ">
                <p className={typography.buttonBody}>
                  MOODS
                </p>

                <p className="
                  text-[10px]
                  tracking-[0.2em]
                  text-white/70
                ">
                  LIKED MOODBOARDS
                </p>
              </div>

            </button>
          }
          bottomRight={
            <div
              className="
                relative
                h-full
                w-full
                overflow-hidden
                bg-zinc-400
                flex
                flex-col
                items-center
                justify-center
                text-white
              "
            >

              {featuredCreator && (
                <button
                  onClick={() =>
                    onNavigate?.({
                      to: "profile",
                      direction: "next",
                      params: {
                        userId: featuredCreator.id,
                        isOwner: false,
                        from: "references"
                      }
                    })
                  }
                  className="
                    flex
                    flex-col
                    items-center
                    hover:opacity-70
                    transition-opacity
                  "
                >
                  <img
                    src={featuredCreator.avatar_url}
                    alt=""
                    className="
                      w-35
                      h-35
                      rounded-full
                      object-cover
                    "
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      tracking-[0.2em]
                    "
                  >
                    {featuredCreator.username}
                  </p>
                </button>
              )}

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  p-4
                "
              >
                <p className={typography.buttonBody}>
                  FEATURED CREATOR
                </p>
              </div>

            </div>
          }
              />

            </div>

          </BookLayout>
        )
      }