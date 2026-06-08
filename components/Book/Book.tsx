"use client"

import { useState } from "react"
import PageFlip from "./PageFlip"

import Cover from "@/components/Cover/Cover"
import Authentification from "@/components/Authentification/Authentification"
import Feed from "@/components/Feed/Feed"

export default function Book() {
  const pages = [
    <Cover />,
    <Authentification />,
    <Feed />
  ]

  const [page, setPage] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState(null)
  const [pendingPage, setPendingPage] = useState(null)

  const goNext = () => {
    if (animating || page >= pages.length - 1) return

    setPendingPage(page + 1)
    setDirection("next")
    setAnimating(true)
  }

  const goPrev = () => {
    if (animating || page <= 0) return

    setPendingPage(page - 1)
    setDirection("prev")
    setAnimating(true)
  }

  const onAnimationEnd = () => {
    setPage(pendingPage)
    setPendingPage(null)
    setAnimating(false)
    setDirection(null)
  }

  return (
    <div className="relative w-[650px] h-[900px] [perspective:2000px]">
      <PageFlip
        current={pages[page]}
        next={pages[pendingPage]}
        animating={animating}
        direction={direction}
        onDone={onAnimationEnd}
        nextClick={goNext}
        prevClick={goPrev}
      />
    </div>
  )
}