"use client"

import { useState } from "react"

import PageFlip from "@/components/Book/PageFlip"

import Cover from "@/components/Cover/page"
import Auth from "@/components/Auth/page"
import Discover from "@/components/Discover/page"
import Profile from "@/components/Profile/ProfilePage"

const PAGES = {
  cover: Cover,
  auth: Auth,
  discover: Discover,
  profile: Profile,
}

export default function Book() {

  const [current, setCurrent] = useState("cover")
  const [next, setNext] = useState(null)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState("next")

  function navigate({ to, direction = "next" }) {

    if (animating) return

    setNext(to)              // page cible
    setDirection(direction)  // sens animation
    setAnimating(true)
  }

  function onDone() {

    setCurrent(next)        // commit page
    setNext(null)
    setAnimating(false)
  }

  const CurrentPage = PAGES[current]
  const NextPage = next ? PAGES[next] : null

  return (
    <div className="w-[800px] h-[1100px] mx-auto">

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
