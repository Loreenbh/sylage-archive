"use client"
import { useState } from "react"
import type { OnNavigate } from "@/types/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout"
import Sidebar from "@/components/navigation/SideBar"
import TwoColGrid from "@/components/ui/grids/TwoColGrid"
import Header from "@/components/navigation/Header"
/* STYLE */
import { typography } from "@/styles/typography"
import { useAuthForm } from "@/hooks/useAuthForm"
import { colors } from "@/styles/colors"
import { spacing } from "@/styles/spacing"
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
            w-full
            border-0
            border-b
            ${colors.input.border}
            bg-transparent
            text-[9px] sm:text-[20px] md:text-base lg:text-[20px] 
            font-light 
            outline-none
            ${colors.input.placeholder}
            focus:border-black/30
            transition-colors duration-200
          `}
        />
        <span
          className={`
            text-[35px] sm:text-[55px] md:text-[60px] lg:text-[85px] 
            font-light 
            ${colors.input.number}
            shrink-0 
            leading-none
            `}
        >
          {String(index).padStart(2, "0")}
        </span>
    </div>
  )
}

export default function Authentification({ onNavigate }: Props) {
  const {
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
  } = useAuthForm(onNavigate)
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
          <button
            onClick={() =>
              onNavigate({
                to: "forgot",
                direction: "next",
              })
            }
            className={`${typography.buttonBody} ${spacing.actionBar} ${colors.text.charcoal}`}
          >
            Forget password →
          </button>
        </div>
      }
    >
    <div className="flex flex-col h-full "> 
      <TwoColGrid
        left={
          <div className={`${colors.bg.stone} flex flex-col justify-between h-full`}>
            <div className="pt-7 sm:pt-35 lg:pt-50">
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
                <p className={`
                  px-3
                  text-[9.5px] sm:px-6 lg:px-12 
                  ${colors.feedback.error}
                  `}
                  >
                  {registerError}
                </p>
              )}
              {registerSuccess &&(
                <p className={`
                  px-3
                  text-[9.5px] sm:px-6 lg:px-12 
                  ${colors.feedback.success} 
                  
                  `}>
                  {registerSuccess}
                </p>
              )}
            </div>

            <button
              onClick={handleRegister}
              className={`${typography.buttonAuth} ${colors.text.charcoal} pb-6`}>
              Join →
            </button>
          </div>
        }
        right={
          <div className={`${colors.bg.earth} flex flex-col justify-between h-full`}>
            <div className="pt-[70px] sm:pt-35 lg:pt-50">
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
                <p className={`
                  px-3 
                  text-[9.5px] sm:px-6 lg:px-12 
                  ${colors.feedback.error}
                  `}
                  >
                  {loginError}
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className={`
                ${typography.buttonAuth} ${colors.text.charcoal} pb-6 `}
              >
              Enter →
            </button>
          </div>
        }
        />
      </div>
    </BookLayout>
  )
}
