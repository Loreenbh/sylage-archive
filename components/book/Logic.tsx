"use client"
import { useState } from "react"
import type { PageName } from "@/types/pages"
import type { NavigationParams } from "@/types/navigation"
/*COMPONENTS*/
import PageFlip from "./PageFlip"
/*PAGES*/
import Cover from "../features/cover/page"
import Authentification from "../features/auth/page"
import Discover from "../features/discover/discover"
import ProfilePage from "../features/profile/profilePage"
import Silhouettes from "../features/profile/silhouettes"
import Loves from "../features/profile/loves"
import Settings from "../features/profile/settings"
import MoodDetails from "../features/discover/moodDetails"

const PAGES = {
  cover: Cover,
  auth: Authentification,
  discover: Discover,
  profile: ProfilePage,
  silhouettes: Silhouettes,
  loves: Loves,
  settings: Settings,
  moodDetails: MoodDetails
} as const


export default function Book() {
  const [current, setCurrent] = useState<PageName>("cover")
  const [next, setNext] = useState<PageName | null>(null)
  const [animating, setAnimating] = useState<boolean>(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const [params, setParams] = useState<NavigationParams["params"] | null>(null)
  
  function navigate({ to, direction = "next", params }: NavigationParams) {
    if (animating) return

    setNext(to)
    setDirection(direction)
    setParams(params ?? null)
    setAnimating(true)
  }

  function onDone() {
    if (!next) return
    setCurrent(next)
    setNext(null)
    setAnimating(false)
  }

  const CurrentPage = PAGES[current]
  const NextPage = next ? PAGES[next] : null

  return (
    <div className="w-full h-full flex">
      <PageFlip
        current={<CurrentPage onNavigate={navigate} params={params}/>}
        next={NextPage ? <NextPage onNavigate={navigate} params={params} /> : null}
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
