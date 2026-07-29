"use client"
import { useState } from "react"
import type { PageName } from "@/types/pages"
import type { NavigationParams } from "@/types/navigation"
/*COMPONENTS*/
import PageFlip from "./PageFlip"
/*PAGES*/
import Cover from "../features/cover/page"
import Authentification from "../features/auth/auth"
import Discover from "../features/discover/discover"
import ProfilePage from "../features/profile/profile"
import Looks from "../features/profile/looks"
import Inspirations from "../features/profile/references"
import Settings from "../features/profile/settings"
import Moods from "../features/profile/moods"
import MoodDetails from "../features/discover/details"
import Create from "../features/creation/selection"
import Editor from "../features/creation/editMood"
import Draw from "../features/creation/editLook"

type HistoryItem = {
  page: PageName
  params: NavigationParams["params"] | null
}

const PAGES = {
  cover: Cover,
  auth: Authentification,
  discover: Discover,
  profile: ProfilePage,
  looks: Looks,
  inspirations: Inspirations,
  settings: Settings,
  moods: Moods,
  moodDetails: MoodDetails,
  create: Create,
  editor: Editor,
  draw: Draw,
} as const


export default function Book() {
  const [current, setCurrent] = useState<PageName>("cover")

  const [currentParams, setCurrentParams] =
    useState<NavigationParams["params"] | null>(null)

  const [next, setNext] = useState<PageName | null>(null)

  const [params, setParams] =
    useState<NavigationParams["params"] | null>(null)
    
  const [history, setHistory] = useState<HistoryItem[]>([])

  const [animating, setAnimating] = useState<boolean>(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")


  function navigate({ to, direction = "next", params }: NavigationParams) {
    if (animating) return

    setHistory(prev => [
      ...prev,
      {
        page: current,
        params: currentParams
      }
    ])

    setNext(to)
    setDirection(direction)
    setParams(params ?? null)
    setAnimating(true)
  }

   function goBack() {

    if (animating) return


    const previous = history[history.length - 1]

    if (!previous) return

    setNext(previous.page)
    setParams(previous.params)
    setDirection("prev")
    setHistory(prev => prev.slice(0, -1))
    setAnimating(true)
  }


  function onDone() {

    if (!next) return


    setCurrent(next)
    setCurrentParams(params)


    setNext(null)
    setParams(null)
    setAnimating(false)
  }


  const CurrentPage = PAGES[current]
  const NextPage = next ? PAGES[next] : null

  return (
    <div className="w-full h-full flex">
      <PageFlip
        current={
          <CurrentPage
            onNavigate={navigate}
            onBack={goBack}
            params={currentParams}
          />
        }
        next={
          NextPage ? (
            <NextPage
              onNavigate={navigate}
              onBack={goBack}
              params={params}
            />
          ) : null
        }
        animating={animating}
        direction={direction}
        onDone={onDone}
      />
    </div>
  )
}

//1. je clique sur une page onNavigate("auth")
//ca appelle la fonction navigate avec auth en parametre
// et ensuite setCurrent change la valeur de cover a auth
//envoi la fonction navigate a la page Cover function Cover ({on Navigate})
// <button onClick={9) => onNavigate("auth")}>
//Aller a auth </button>
//1. je clique sur une page onNavigate("auth")
//ca appelle la fonction navigate avec auth en parametre
// et ensuite setCurrent change la valeur de cover a auth
//envoi la fonction navigate a la page Cover function Cover ({on Navigate})
// <button onClick={9) => onNavigate("auth")}>
//Aller a auth </button>
