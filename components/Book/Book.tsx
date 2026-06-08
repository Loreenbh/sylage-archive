/*logique (pages + flip + clics)*/

"use client"

import { useState } from "react"
import Cover from "@/components/Cover/Cover"
import PageFlip from "./PageFlip"
import Authentification from "@/components/Authentification/Authentification"

export default function Book() {
  const [flipped, setFlipped] = useState(false)

  return (
    <div onClick={() => setFlipped(true)}>
      <PageFlip isFlipped={flipped}>
        <Cover />
        <Authentification />
      </PageFlip>
    </div>
  )
}