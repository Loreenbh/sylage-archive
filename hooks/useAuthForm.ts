import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"

 export function useAuthForm(onNavigate: OnNavigate) {
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
      setRegisterForm((prev) => ({
        ...prev,
        [field]:
          field === "username" || field === "email"
            ? value.toLowerCase()
            : value,
      }))

  const updateLoginField =
    (field: keyof typeof loginForm) => (value: string) =>
      setLoginForm((prev) => ({
        ...prev,
        [field]:
          field === "identifier"
            ? value.toLowerCase()
            : value,
      }))


    const handleRegister = async () =>{
      setRegisterError(null)
      setRegisterSuccess(null)
      if (!registerForm.password || !registerForm.confirmPassword
         || !registerForm.email || !registerForm.username
      ){
        setRegisterError("Missing required fields")
        return
      }

    if (registerForm.password !== registerForm.confirmPassword){
      setRegisterError("Passwords do not match")
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

      const registerData = await registerRes.json()
  
      if (!registerRes.ok){
        setRegisterError(registerData.error ?? "Registration failed")
        return
      }

      setRegisterSuccess("Registration successful, please log in")
      setRegisterForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
      } catch {
        setRegisterError("Network error")
      } finally {
        setIsSubmitting(false)
      }
    } 

    const handleLogin = async () => {
      setLoginError(null)

      if (!loginForm.identifier || !loginForm.password) {
        setLoginError("Missing required fields")
        return
      }
      setIsSubmitting(true)
      try{
        const res = await fetch("/api/auth/login",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginForm),
        })
        const data = await res.json()
        if (!res.ok){
          setLoginError(data.error ?? "Login failed")
          return
        }
         onNavigate({
            to: "discover",
            direction: "next",
          })
        } catch {
          setLoginError("Network error")
        } finally {
          setIsSubmitting(false)
      }
    }
    return {
        registerForm,
        loginForm,
        registerError,
        registerSuccess,
        loginError,
        isSubmitting,
        updateRegisterField,
        updateLoginField,
        handleRegister,
        handleLogin
  }
}