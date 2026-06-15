import { Roboto } from "next/font/google"

export const typography = {
  // Mobile first: text-2xl → scaling up to text-8xl on desktop
  title:
    "text-2xl sm:text-7xl md:text-4xl lg:text-6xl xl:text-8xl tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] xl:tracking-[0.4em] text-black/60",
  
  // Mobile first: text-xs → scaling up to text-base on desktop
  subtitle:
    "text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.4em] sm:tracking-[0.45em] md:tracking-[0.5em] uppercase text-black/70",
  
  // Mobile first: text-xs, tracking responsive
  texte:
    "text-[8px] sm:text-xs md:text-s tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] text-black/60",
}