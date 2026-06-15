import { useRef, useState, useEffect } from "react"

type Props = {
  data: any[]
  renderItem: (item: any) => React.ReactNode
  height?: number
}

function ScrollBar({ scrollRef }: { scrollRef: any }) {
  const [thumbTop, setThumbTop] = useState(0)
  const [thumbHeight, setThumbHeight] = useState(60)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      const ratio = el.clientHeight / el.scrollHeight
      const height = Math.max(ratio * el.clientHeight, 40)

      const maxScroll = el.scrollHeight - el.clientHeight
      const scrollRatio = maxScroll > 0 ? el.scrollTop / maxScroll : 0

      const maxTop = el.clientHeight - height

      setThumbHeight(height)
      setThumbTop(scrollRatio * maxTop)
    }

    el.addEventListener("scroll", update)
    update()

    return () => el.removeEventListener("scroll", update)
  }, [scrollRef])

  return (
    <div className="relative w-[2px] h-full bg-black/10 rounded-full overflow-hidden">
      <div
        className="absolute w-full bg-black/20 rounded-full"
        style={{
          height: thumbHeight,
          top: thumbTop,
        }}
      />
    </div>
  )
}

export default function ScrollableGrid({
  data,
  renderItem,
  height = 704,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const rows = []
  for (let i = 0; i < data.length; i += 2) {
    rows.push(data.slice(i, i + 2))
  }

  return (
    <div className="flex gap-2 w-full" style={{ height }}>

      {/* LEFT scrollbar */}
      <ScrollBar scrollRef={scrollRef} />

      {/* RIGHT scroll area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{
          height,
          scrollbarWidth: "none",
        }}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>

        <div className="flex flex-col gap-1">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-2 gap-4">
              {row.map((item, i) => (
                <div key={i}>{renderItem(item)}</div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}