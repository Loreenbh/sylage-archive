/* ROTATION ANIMATION TRANSITION */

"use client"

export default function PageFlip({ isFlipped, children }) {
  return (
    <div
      className={`
        [cursor:pointer]
        transition-transform duration-1000 ease-in-out
        [transform-style:preserve-3d]
        [perspective:2000px]
        [box-shadow:inset_20px_0_50px_rgba(0,0,0,0.4)]        
        [transform-origin:left]
        ${isFlipped ? "[transform:rotateY(-180deg)]" : ""}   
        `}
    >
      {children}
    </div>
  )
}

/*         transition-transform duration-700 ease-in-out*/
/*         transition-transform duration-1200
*/