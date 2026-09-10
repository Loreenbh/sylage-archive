"use client"

import { useState } from "react"
import BookLayout from "@/components/book/BookLayout"
import Header from "@/components/navigation/Header"
import Sidebar from "@/components/navigation/SideBar"

import { typography } from "@/styles/typography"
import { colors } from "@/styles/colors"

import { supabaseBrowser } from "@/lib/supabase-browser"

const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 35

function MagazineInput({
  placeholder,
  type = "text",
  index,
  value,
  onChange,
}: {
  placeholder: string
  type?: string
  index: number
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="w-full flex space-y-4 px-8 pt-18 sm:px-6 lg:px-12">
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
          text-[10px] sm:text-[20px] md:text-base lg:text-[20px]
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

type Props = {
  onNavigate: (params: any) => void
  onBack: () => void
}

export default function UpdatePassword({
  onNavigate,
  onBack,
}: Props) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [status, setStatus] = useState<
    "idle" | "updating" | "success" | "error"
  >("idle")

  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async () => {
    setErrorMessage("")

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both fields")
      setStatus("error")
      return
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      )
      setStatus("error")
      return
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      setErrorMessage("Password is too long")
      setStatus("error")
      return
    }

    if (!PASSWORD_REGEX.test(password)) {
      setErrorMessage(
        "Password must contain at least a letter, a number, and a special character"
      )
      setStatus("error")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      setStatus("error")
      return
    }

    setStatus("updating")

    const { error } = await supabaseBrowser.auth.updateUser({
      password,
    })

    if (error) {
      console.error("[UPDATE PASSWORD] Error:", error)

      setErrorMessage("Unable to update password")
      setStatus("error")
      return
    }

    setStatus("success")

    setTimeout(() => {
      onBack()
    }, 1000)
  }

  return (
    <BookLayout
      header={
        <Header
          items={[
            { section: "HOME", clickable: false },
            { section: "FILTER", clickable: false },
            { section: "CREATE", clickable: false },
          ]}
        />
      }
      sidebar={
        <Sidebar
          text="ACCESS"
          clickable={false}
        />
      }
      actionsBar={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onBack}
            className={`
              ${typography.buttonBody}
              px-4
              ${colors.text.charcoal}
              cursor-pointer
              transition-opacity
              hover:opacity-50
            `}
          >
            back
          </button>

          {status === "success" ? (
            <p
              className={`
                ${typography.buttonBody}
                ${colors.text.charcoal}
              `}
            >
              Updated ✓
            </p>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                status === "updating" ||
                !password ||
                !confirmPassword
              }
              className={`
                ${typography.buttonBody}
                ${colors.text.charcoal}
                transition-opacity
                hover:opacity-60
                cursor-pointer
                disabled:opacity-40
              `}
            >
              {status === "updating"
                ? "Updating..."
                : "Update →"}
            </button>
          )}

          {status === "error" && (
            <>
              <span className={typography.bullet}>•</span>

              <p
                className={`
                  ${typography.buttonBody}
                  ${colors.feedback.error}
                `}
              >
                {errorMessage}
              </p>
            </>
          )}
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div
          className={`
            ${colors.bg.earth}
            flex
            flex-col
            justify-between
            h-full
          `}
        >
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p
                className={`
                  ${typography.buttonBody}
                  ${colors.text.charcoal}
                `}
              >
                Password updated ✓
              </p>
            </div>
          ) : (
            <>
              <div className="pt-7 sm:pt-35 lg:pt-50">
                <MagazineInput
                  placeholder="New password"
                  type="password"
                  index={1}
                  value={password}
                  onChange={setPassword}
                />

                <MagazineInput
                  placeholder="Confirm password"
                  type="password"
                  index={2}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>

              <p
                className={`
                  px-3
                  sm:px-6
                  lg:px-12
                  pb-6
                  text-[8px]
                  sm:text-[10px]
                  ${colors.text.charcoal}
                  opacity-50
                `}
              >
                PASSWORD UPDATE · NEW PASSWORD REQUIRED
              </p>
            </>
          )}
        </div>
      </div>
    </BookLayout>
  )
}