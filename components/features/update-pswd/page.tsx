"use client";

import { useState } from "react";
import BookLayout from "@/components/book/BookLayout";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/SideBar";

import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";

import { supabaseBrowser } from "@/lib/supabase-browser";

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 35;

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
    <div className="w-full flex space-y-3 sm:space-y-8 px-3 sm:px-6 lg:px-8">
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
          text-[9px] sm:text-[16px] md:text-base lg:text-[18px]
          font-light
          outline-none
          ${colors.input.placeholder}
          focus:border-black/30
          transition-colors duration-200
        `}
      />

      <span
        className={`
          text-[35px] pl-2 sm:text-[55px] md:text-[63px] lg:text-[100px]
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

export default function UpdatePassword({ onNavigate, onBack }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<
    "idle" | "updating" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both fields");
      setStatus("error");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      );
      setStatus("error");
      return;
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      setErrorMessage("Password is too long");
      setStatus("error");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setErrorMessage(
        "Password must contain at least a letter, a number, and a special character",
      );
      setStatus("error");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setStatus("error");
      return;
    }

    setStatus("updating");

    const { error } = await supabaseBrowser.auth.updateUser({
      password,
    });

    if (error) {
      console.error("[UPDATE PASSWORD] Error:", error);

      setErrorMessage(error.message || "Unable to update password");
      setStatus("error");
      return;
    }

    setStatus("success");
    setSuccessMessage("Password updated ✓");

    setTimeout(() => {
      onBack();
    }, 1000);
  };

  return (
    <BookLayout
      header={
        <Header
          items={[
            {
              section: "HOME",
              clickable: false,
            },
            {
              section: "FILTER",
              clickable: false,
            },
            {
              section: "CREATE",
              clickable: false,
            },
          ]}
        />
      }
      sidebar={<Sidebar text="ACCESS" clickable={false} />}
      actionsBar={
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={`
              ${typography.buttonBodyFocus}
              ${spacing.actionBar}
              ${colors.text.charcoal}
            `}
          >
            Back
          </button>
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
                  ${typography.feedback}
                  ${colors.feedback.success}
                `}
              >
                {successMessage}
              </p>
            </div>
          ) : (
            <>
              <div className="pt-7 sm:pt-35 lg:pt-43">
                <MagazineInput
                  placeholder="New password"
                  type="password"
                  index={1}
                  value={password}
                  onChange={(value) => {
                    setPassword(value);

                    if (status === "error") {
                      setStatus("idle");
                      setErrorMessage("");
                    }
                  }}
                />

                <MagazineInput
                  placeholder="Password again"
                  type="password"
                  index={2}
                  value={confirmPassword}
                  onChange={(value) => {
                    setConfirmPassword(value);

                    if (status === "error") {
                      setStatus("idle");
                      setErrorMessage("");
                    }
                  }}
                />

                {errorMessage && (
                  <p
                    className={`
                      ${typography.feedback}
                      ${colors.feedback.error}
                      ${spacing.feedback}
                    `}
                  >
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={status === "updating"}
                className={`
                  ${typography.buttonAuth}
                  ${colors.text.charcoal}
                  pb-10
                `}
              >
                {status === "updating" ? "Updating..." : "Update →"}
              </button>
            </>
          )}
        </div>
      </div>
    </BookLayout>
  );
}
