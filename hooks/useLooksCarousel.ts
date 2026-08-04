import { useState } from "react"

export function useLooksCarousel<T>(items: T[], step = 3) {
  const [index, setIndex] = useState(0)

  const visibleItems = {
    left: items[index],
    center: items[index + 1],
    right: items[index + 2],
  }

  const currentItem = Math.min(
    index + step,
    items.length
  )

  const canPrev = index > 0

  const canNext = index + step < items.length

  const handleNext = () => {
    setIndex((i) =>
      Math.min(
        i + step,
        Math.max(items.length - step, 0)
      )
    )
  }

  const handlePrev = () => {
    setIndex((i) => Math.max(i - step, 0))
  }

  return {
    ...visibleItems,
    currentItem,
    canPrev,
    canNext,
    handleNext,
    handlePrev,
  }
}