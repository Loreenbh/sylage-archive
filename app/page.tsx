"use client"

/* FALSE=PAGE NORMAL, PAGE TOURNEE TRUE*/
import { useState } from "react"
import PageFlip from "@/components/Book/PageFlip"
import FormatDouble from "@/components/FormatDouble"
import Cover from "@/components/Cover/Cover"

export default function Home() {
  const [flipped, setFlipped] = useState(false) /*fonction react stcoker valeur qui peut chnager*/
  return (
      <div onClick={() => setFlipped(!flipped)}>
      <PageFlip isFlipped={flipped}>
        {flipped ? <FormatDouble /> : <Cover />}
      </PageFlip>
    </div>
  )

}  
