"use client";

import { useState } from "react";
import BookLayout from "@/components/book/BookLayout";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/SideBar";

import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";

import { supabaseBrowser } from "@/lib/supabase-browser";

function MagazineInput({
  placeholder,
  type = "text",
  index,
  value,
  onChange,
}: {
  placeholder: string;
  type?: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
<div className="w-full h-full flex items-center sm:px-6 lg:px-4 xl:px-12">
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
      sm:text-[10px]
      md:text-[11px]
      lg:text-[14px]
      xl:text-[20px]
      font-light
      outline-none
      ${colors.input.placeholder}
      focus:border-black/30
      transition-colors duration-200
    `}
  />

  <span
    className={`
      text-[35px]
      sm:text-[55px]
      md:text-[59px]
      lg:text-[30px]
      xl:text-[85px]
      font-light
      ${colors.input.number}
      shrink-0
      leading-none
    `}
  >
    {String(index).padStart(2, "0")}
  </span>
</div>
  );
}

type Props = {
  onNavigate: (params: any) => void;
  onBack: () => void;
};

export default function ForgotPassword({ onNavigate, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const handleSubmit = async () => {
    if (!email) return;

    setStatus("sending");

    const result = await supabaseBrowser.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=update`,
    });

    if (result.error) {
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

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
      sidebar={<Sidebar text="ACCESS" clickable={false} />}
      actionsBar={
        <div className="flex items-center sm:gap-4 md:gap-4 ml-7 mt-1 lg:mt-3">
          <button
            onClick={onBack}
            className={`
        ${typography.buttonBodyFocus}
        ${colors.text.charcoal}
        cursor-pointer
        transition-opacity
        hover:opacity-50
      `}
          >
            back
          </button>
          <span className={typography.bullet}>•</span>

          {status === "sent" ? (
            <p
              className={`
          ${typography.buttonBodyFocus}
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
          ${typography.buttonBodyFocus}
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
            ${typography.buttonBodyFocus}
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
        <div
          className="
            w-full
            sm:pt-20
            sm:w-[220px]
            md:pt-22
            md:pl-0
            md:w-full
            md:max-w-[500px]
            lg:pt-16
            lg:pl-0
            lg:w-full
            lg:max-w-[500px]
            xl:pt-50
            xl:pl-30
            xl:w-[700px]
          "
          >
            <MagazineInput
              placeholder="Email"
              type="email"
              index={1}
              value={email}
              onChange={setEmail}
            />
          </div>
        </div>
      </div>
    </BookLayout>
  );
}
