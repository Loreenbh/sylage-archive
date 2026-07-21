"use client"
import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import TwoColGrid from "@/components/ui/grids/TwoColGrid"
import Header from "@/components/navigation/Header"
/* STYLE */
import { typography } from "@/styles/typography"

/*TYPES*/
type Props = {
  onNavigate: OnNavigate
}

type Props1 = {
  placeholder: string
  type?: string
  index: number, 
  value: string,
  onChange: (value: string) => void
}
/*------------------------------------------------- */

function MagazineInput({ placeholder, type = "text", index, value, onChange } : Props1) {
  return (
    <div className="w-full flex space-y-6 px-3 sm:px-6 lg:px-12">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-[100%] border-0 border-b border-black/40 bg-transparent
            text-[10px] sm:text-[20px] md:text-base lg:text-[20px] font-light outline-none
            placeholder:text-black/30
            focus:border-black/30
            transition-colors duration-200
          `}
        />
        <span
          className={`
            text-[35px] sm:text-[55px] md:text-[60px] lg:text-[85px] font-light 
            text-black/30 shrink-0 leading-none`}
        >
          {String(index).padStart(2, "0")}
        </span>
    </div>
  )
}

export default function Authentification({ onNavigate }: Props) {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: ""
  })
  
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)

  const [loginError, setLoginError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateRegisterField =
    (field: keyof typeof registerForm) => (value: string) =>
      setRegisterForm((prev) => ({ ...prev, [field]: value }))

  const updateLoginField =
    (field: keyof typeof loginForm) => (value: string) =>
      setLoginForm((prev) => ({ ...prev, [field]: value }))



    /* INSCRIPTION */
    const handleRegister = async () =>{
      setRegisterError(null)
      setRegisterSuccess(null)
      if (!registerForm.password || !registerForm.confirmPassword
         || !registerForm.email || !registerForm.username
      ){
        setRegisterError("Champs manquants!")
        return
      }

    if (registerForm.password !== registerForm.confirmPassword){
      setRegisterError("Lesmoys de passe ne correspondent pas")
      return
    }



    setIsSubmitting(true)

    try{
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        })
      })

      //const body = await request.json() et apres recup response back
      const registerData = await registerRes.json()
  
      if (!registerRes.ok){
        setRegisterError(registerData.error ?? "Erreur lors de l'inscription")
        return
      }

      setRegisterSuccess("Inscription reussie, veuillez vous connecter")
      setRegisterForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
      } catch {
        setRegisterError("Error network")
      } finally {
        setIsSubmitting(false)
      }
    } 

    /* CONNEXION */
    const handleLogin = async () => {
      setLoginError(null)
      setIsSubmitting(true)

      if (!loginForm.identifier || !loginForm.password) {
        setLoginError("Champs manquants")
        return
      }

      try{
        const res = await fetch("/api/auth/login",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginForm),
        })
            console.log("Status :", res.status)
        const data = await res.json()
        if (!res.ok){
          setLoginError(data.error ?? "Erreur de connexion")
          return
        }
         onNavigate({
            to: "discover",
            direction: "next",
            // params: { currentUser: data.username },
          })
        } catch {
          setLoginError("Erreur réseau")
        } finally {
          setIsSubmitting(false)
      }
    }


  return (

    <BookLayout
      header={
        <Header
          items={[
            { section: "HOME",
              clickable: false,
            },
            { section: "FILTER",
              clickable: false,
             },
            { section: "CREATE",
              clickable: false,
             },
          ]}
        />
      }
      sidebar={<Sidebar text="ACCESS" clickable={false} />}
      actionsBar={        
          <div className="flex items-center">
            <button className={typography.buttonBody}>Forget password →</button>
          </div>
        }
    >
    <div className="flex flex-col h-full "> 
      <TwoColGrid
        left={
          <div className="bg-pink-200 flex flex-col justify-between h-full">
            <div className="pt-16 sm:pt-35 lg:pt-50">
              <MagazineInput 
                placeholder="Pseudo" 
                index={1}
                value = {registerForm.username}
                onChange={updateRegisterField("username")}
              />
              <MagazineInput 
                placeholder="Email" 
                index={2} 
                value={registerForm.email}
                onChange={updateRegisterField("email")}
              />
              <MagazineInput 
                placeholder="Password" 
                index={3}
                type="password"
                value={registerForm.password}
                onChange={updateRegisterField("password")}
              />
              <MagazineInput 
                placeholder="Confirm password" 
                index={4}
                type="password"
                value={registerForm.confirmPassword}
                onChange={updateRegisterField("confirmPassword")}
              />
              {registerError &&(
                <p className="px-3 sm:px-6 lg:px-12 text-red-600 text-xs mt-2">
                  {registerError}
                </p>
              )}
              {registerSuccess &&(
                <p className="px-3 sm:px-6 lg:px-12 text-green-600 text-xs mt-2">
                  {registerSuccess}
                </p>
              )}
            </div>

            <button
              onClick={handleRegister}
              // onClick={() => onNavigate({ to: "discover", direction: "next" })}
              className={`${typography.buttonAuth} pb-6`}>
              Join →
            </button>
          </div>
        }
        right={
          <div className="bg-pink-300 flex flex-col justify-between h-full">
            <div className="pt-16 sm:pt-35 lg:pt-50">
              <MagazineInput 
                placeholder="Email/username" 
                type="text"
                index={1}
                value={loginForm.identifier}
                onChange={updateLoginField("identifier")} />
              <MagazineInput 
                placeholder="Password" 
                type="password"
                index={2}
                value={loginForm.password}
                onChange={updateLoginField("password")} />

                {loginError &&(
                <p className="px-3 sm:px-6 lg:px-12 text-red-600 text-xs mt-2">
                  {loginError}
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className={`${typography.buttonAuth} pb-6 `}>
              Enter →
            </button>
          </div>
        }
        />
      </div>
    </BookLayout>
  )
}
