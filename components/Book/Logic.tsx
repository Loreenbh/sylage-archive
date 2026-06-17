"use client"

import { useState } from "react"
import PageFlip from "@/components/Book/PageFlip"

import Cover from "../Pages/Cover/page"
import Authentification from "../Pages/Auth/page"
import Discover from "../Pages/Discover/page"
import ProfilePage from "../Pages/Profile/ProfilePage"

const PAGES = {
  cover: Cover,
  auth: Authentification,
  discover: Discover,
  profile: ProfilePage,
}

type NavigationParams = {
  to: string
  direction?: "next" | "prev"
}


export default function Book() {
  const [current, setCurrent] = useState<string>("cover")
  const [next, setNext] = useState<string | null>(null)
  const [animating, setAnimating] = useState<boolean>(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  
  function navigate({ to, direction = "next" }: NavigationParams) {
    if (animating) return

    setNext(to)
    setDirection(direction)
    setAnimating(true)
  }

  function onDone() {
    setCurrent(next)
    setNext(null)
    setAnimating(false)
  }

  const CurrentPage = PAGES[current]
  const NextPage = next ? PAGES[next] : null

  return (
    <div className="w-full h-full flex">
      <PageFlip
        current={<CurrentPage onNavigate={navigate} />}
        next={NextPage ? <NextPage onNavigate={navigate} /> : null}
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
