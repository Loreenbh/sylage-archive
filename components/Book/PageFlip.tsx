export default function PageFlip({ isFlipped, children }) {
  const [front, back] = children

  return (
    <div className="relative w-[650px] h-[900px] [perspective:2000px]">

      {/* PAGE DU DESSOUS */}
      <div className="absolute inset-0 z-0">
        {back}
      </div>

      {/* PAGE DU DESSUS */}
      <div
        className={`
          absolute inset-0 z-10
          origin-left
          transition-transform duration-1000 ease-in-out
          [transform-style:preserve-3d]
          ${isFlipped ? "[transform:rotateY(-180deg)]" : ""}
        `}
      >
        {front}
      </div>

    </div>
  )
}