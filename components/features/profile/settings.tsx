"use client"
import { useState, useEffect } from "react"
import type { OnNavigate, NavigationParams } from "@/types/navigation"

/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import Header from "@/components/navigation/Header"
import FourSquaresGrid from "@/components/ui/grids/FourSquareGrid"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { uploadImage } from "@/lib/services/upload"
import { updateUser, deleteUser} from "@/lib/services/profile"
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

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState("")

const handleDeleteAccount = async () => {

  try {

    await deleteUser()

    setDeleteMessage("Account deleted")


    // après suppression tu peux renvoyer vers login/home
    onNavigate?.({
      to:"cover",
      direction:"prev"
    })


  } catch(error) {

    if(error instanceof Error){
      setDeleteMessage(error.message)
    } else {
      setDeleteMessage("Delete failed")
    }

  }

}




useEffect(() => {
  if (user) {
    setAvatar(user.avatar_url ?? null)
    setUsername(user.username)
  }
}, [user])

const handleUsernameChange = async () => {

  setUsernameMessage("")


  if (!username) {
    setUsernameMessage("Missing username")
    return
  }


  if (username.length < 3) {
    setUsernameMessage("Username must be at least 3 characters")
    return
  }


  if (username.length > 20) {
    setUsernameMessage("Username must be less than 20 characters")
    return
  }


  try {

    await updateUser({
      username
    })

    setUsernameMessage("Username updated")


  } catch(error) {

    if(error instanceof Error){
      setUsernameMessage(error.message)
    }

  }
}



  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0]

    if (!file) return


    try {

      const imageData = await fileToBase64(file)

      const imageUrl = await uploadImage(imageData)

      await updateUser({
        avatar_url: imageUrl
      })

      setAvatar(imageUrl)

    } catch(error) {

      console.error(
        "Erreur changement avatar",
        error
      )

    }
  }

const handlePasswordChange = async () => {

  setMessage("")


  if (!oldPassword || !newPassword || !confirmPassword) {
    setMessage("Missing fields")
    return
  }


  if (newPassword !== confirmPassword) {
    setMessage("Passwords don't match")
    return
  }


  try {

    await updateUser({
      oldPassword,
      password: newPassword
    })


    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")

    setMessage("Password updated")


  } catch (error) {

    if (error instanceof Error) {
      setMessage(error.message)
    } else {
      setMessage("Password update failed")
    }

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
             },
            { section: "CREATE",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                  params:{
                    from: "discover",
                  }
                }),
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
          <div
            className="
              h-full w-full
              bg-zinc-300
              flex flex-col
              justify-between
              p-4
            "
          >

            <div className="flex flex-col gap-4">

              <input
                type="password"
                value={oldPassword}
                onChange={(e)=>setOldPassword(e.target.value)}
                placeholder="current password"
                className="
                  bg-transparent
                  border-b
                  border-black/30
                  outline-none
                  text-sm
                  tracking-wide
                "
              />


              <input
                type="password"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                placeholder="new password"
                className="
                  bg-transparent
                  border-b
                  border-black/30
                  outline-none
                  text-sm
                  tracking-wide
                "
              />


              <input
                type="password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                placeholder="confirm password"
                className="
                  bg-transparent
                  border-b
                  border-black/30
                  outline-none
                  text-sm
                  tracking-wide
                "
              />


              <button
                className={typography.buttonBody}
                onClick={handlePasswordChange}
              >
                save
              </button>


              {message && (
                <span className="text-xs opacity-60 tracking-wide">
                  {message}
                </span>
              )}

            </div>


            <span className={typography.buttonBody}>
              Change password
            </span>

          </div>
        }
        bottomLeft={
          <div
            className="
              h-full w-full
              bg-zinc-400
              flex flex-col
              justify-between
              p-4
            "
          >

            <div className="flex flex-col gap-4">


              <input
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="new username"
                className="
                  bg-transparent
                  border-b
                  border-black/30
                  outline-none
                  text-sm
                  tracking-wide
                "
              />


              <button
                className={typography.buttonBody}
                onClick={handleUsernameChange}
              >
                save
              </button>



              {usernameMessage && (
                <span className="text-xs opacity-60 tracking-wide">
                  {usernameMessage}
                </span>
              )}


            </div>



            <span className={typography.buttonBody}>
              Change username
            </span>


          </div>
        }
        bottomRight={
          <div
            className="
              h-full w-full
              bg-zinc-500
              flex flex-col
              justify-between
              p-4
            "
          >

            {!deleteConfirm ? (

              <button
                onClick={() => setDeleteConfirm(true)}
                className={typography.buttonBody}
              >
                Delete account
              </button>

            ) : (

              <div className="flex flex-col gap-4">

                <span className="text-sm">
                  Delete your account permanently?
                </span>


                <div className="flex gap-4">

                  <button
                    onClick={handleDeleteAccount}
                    className={typography.buttonBody}
                  >
                    confirm
                  </button>


                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className={typography.buttonBody}
                  >
                    cancel
                  </button>

                </div>

              </div>

            )}


            {deleteMessage && (
              <span className="text-xs opacity-60">
                {deleteMessage}
              </span>
            )}


          </div>
        }
      />
    </BookLayout>
  )
}