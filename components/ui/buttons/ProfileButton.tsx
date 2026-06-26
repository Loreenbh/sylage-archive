import type { OnNavigate } from "@/types/navigation"
/* TYPES */
type Props = {
  onNavigate: OnNavigate
}
/*------------------------------------------ */
export default function ProfileButton({ onNavigate }: Props) {
  return (
    <button
      onClick={() =>
        onNavigate({
          to: "profile",
          direction: "next",
          params:{
            isOwner: true
          }
        })
      }
      className=" bg-red-600 w-9 h-9 md:w-14 md:h-14 lg:w-18 lg:h-18 rounded-full bg-black/10 hover:bg-black/20 transition"
    />
  )
}