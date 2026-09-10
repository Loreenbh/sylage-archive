"use client"

import { useState } from "react"
import { OnNavigate } from "@/types/navigation"
import BookLayout from "@/components/book/BookLayout"
import Header from "@/components/navigation/Header"
import Sidebar from "@/components/navigation/SideBar"

import { typography } from "@/styles/typography"
import { spacing } from "@/styles/spacing"
import { colors } from "@/styles/colors"

import { supabaseBrowser } from "@/lib/supabase-browser"

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

export default function ForgotPassword({
  onNavigate,
  onBack,
}: Props) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle")

  const handleSubmit = async () => {
  if (!email) return

  setStatus("sending")


  const result = await supabaseBrowser.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  })

  if (result.error) {
    setStatus("error")
    return
  }

  setStatus("sent")
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

    {status === "sent" ? (
      <p
        className={`
          ${typography.buttonBody}
          ${colors.text.charcoal}
        `}
      >
        Sent ✓
      </p>
    ) : (
      <button
        onClick={handleSubmit}
        disabled={!email || status === "sending"}
        className={`
          ${typography.buttonBody}
          ${colors.text.charcoal}
          transition-opacity
          hover:opacity-60
          cursor-pointer
          disabled:opacity-40
        `}
      >
        {status === "sending" ? "Sending..." : "Send →"}
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
          Error
        </p>
      </>
    )}
  </div>
}
    >
      <div className="flex flex-col h-full">
        <div
          className={`
            ${colors.bg.stone}
            flex
            flex-col
            justify-between
            h-full
          `}
        >
          <div className="pt-7 sm:pt-35 lg:pt-50">
            <MagazineInput
              placeholder="Email"
              type="email"
              index={1}
              value={email}
              onChange={setEmail}
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
            PASSWORD RECOVERY · EMAIL REQUIRED
          </p>
        </div>
      </div>
    </BookLayout>
  )
}