"use client"
import { useState, useEffect } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import FourSquaresGrid from "@/components/ui/grids/FourSquareGrid"
import ProfileButton from "@/components/ui/buttons/ProfileButton"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { uploadImage } from "@/lib/services/upload"
import { updateAvatar } from "@/lib/services/profile"
/* STYLE */
import { typography } from "@/styles/typography"
import Avatar from "@/components/ui/pagination/Avatar"

/* TYPES */
type Props = {
  onNavigate: OnNavigate
  params?: NavigationParams["params"] | null
  
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = reject

  })
}

export default function Settings({ onNavigate}: Props) {
  const { user } = useCurrentUser()
  const [avatar, setAvatar] = useState<string | null>(null)



  useEffect(() => {
    if (user) {
      setAvatar(user.avatar_url ?? null)
      console.log("user existe")
    }
  }, [user])


  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (!file) return


    try {

      const imageData = await fileToBase64(file)

      const imageUrl = await uploadImage(imageData)
      console.log("URL UPLOAD :", imageUrl)
      await updateAvatar(imageUrl)

      setAvatar(imageUrl)

    } catch (error) {

      console.error(
        "Erreur changement avatar",
        error
      )

    }
  }
  return (
    <BookLayout
      header={
        <Header
          items={[
            { section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "discover",
                  direction: "prev",
                })
            },
            { section: "FILTER",
              clickable: false,
              onClick: () => console.log("filter clicked"),
             },
            { section: "CREATE",
              clickable: true,
              onClick: () => console.log("create clicked"),
             },
          ]}
        />
      }
      sidebar={<Sidebar text="SETTINGS" clickable={false} />}
      actionsBar={
        <button
          onClick={() =>
            onNavigate?.({
              to: "profile",
              direction: "prev",
              params:{
                isOwner:true
              }
            })
          }
          className={typography.buttonBody}
        >
          back
        </button>
      }
    >
      <FourSquaresGrid
       topLeft={
          <label
            className="
              relative
              h-full
              w-full
              bg-pink-200
              flex
              items-end
              p-4
              hover:bg-zinc-300
              transition
              cursor-pointer
              overflow-hidden
            "
          >

           {user && (
              <Avatar
                user={{
                  ...user,
                  avatar_url: avatar
                }}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  rounded-none
                "
              />
            )}


            <span
              className="
                relative
                z-10
                text-white
                drop-shadow
              "
            >
              Change avatar
            </span>


            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

          </label>
        }
        topRight={
          <button className="h-full w-full bg-zinc-300 flex items-end p-4 hover:bg-zinc-400 transition">
            <span className={typography.body}>Privacy</span>
          </button>
        }
        bottomLeft={
          <button className="h-full w-full bg-zinc-400 flex items-end p-4 hover:bg-zinc-500 transition">
            <span className={typography.body}>Notifications</span>
          </button>
        }
        bottomRight={
          <button className="h-full w-full bg-zinc-500 flex items-end p-4 hover:bg-zinc-600 transition">
            <span className={typography.body}>Appearance</span>
          </button>
        }
      />
    </BookLayout>
  )
}