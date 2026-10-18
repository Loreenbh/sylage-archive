"use client";
import type { OnNavigate } from "@/types/navigation";
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import TwoColGrid from "@/components/ui/grids/TwoColGrid";
import Header from "@/components/navigation/Header";
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";
import { useAuthForm } from "@/hooks/useAuthForm";

type Props = {
  onNavigate: OnNavigate;
};

type PropsInput = {
  placeholder: string;
  type?: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
};

function MagazineInput({
  placeholder,
  type = "text",
  index,
  value,
  onChange,
}: PropsInput) {
  return (
    <div className="w-full flex items-center px-[clamp(8px,2cqw,24px)]">
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
          text-[clamp(9px,3.8cqw,18px)]
          font-light 
          outline-none
          ${colors.input.placeholder}
          focus:border-black/30
          transition-colors duration-200
        `}
      />
      <span
        className={`
          pl-1 text-[clamp(18px,8cqw,65px)]
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
    handleLogin,
  } = useAuthForm(onNavigate);

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
        <div
          className={`
            flex
            items-center
            ${spacing.actionBar}
            ${colors.text.charcoal}
            w-full
          `}
        >
          <button
            onClick={() =>
              onNavigate({
                to: "forgot",
                direction: "next",
              })
            }
            className={`${typography.actionBar} ${colors.text.charcoal}`}
          >
            Forgot pass
          </button>
          <span className={typography.bullet}>•</span>
          <button
            onClick={() =>
              onNavigate({
                to: "discover",
                direction: "next",
              })
            }
            className={`${typography.actionBar} ${colors.text.charcoal}`}
          >
            Guest Access
          </button>
        </div>
      }
      footerLeft={
        <div className="w-[85cqw] border-t border-black/20 pt-[1cqw] leading-tight">
          <p className="text-[clamp(6px,0.9cqw,10px)] tracking-[0.13em] text-black/55">
            BEHIND THE PROJECT
          </p>

          <p className="mt-[0.5cqw] text-[clamp(6px,1cqw,10px)] tracking-[0.01em] text-black/55">
            Concept · UX/UI · Art Direction · Development
          </p>

          <a
            href="https://sylage-archive.vercel.app/studycase.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore the case study (opens in a new tab)"
            className="mt-[0.6cqw] inline-block text-[clamp(6px,1.05cqw,11px)] text-[#211C19] transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-1"
          >
            Explore the case study ↗
          </a>
        </div>
      }
      >
      <div className="flex flex-col h-full w-full">
        <TwoColGrid
          left={
            <div
              className={`${colors.bg.stone} flex flex-col justify-between h-full p-[clamp(8px,2cqw,16px)]`}
            >
              <div className="flex flex-col justify-center flex-1 space-y-[clamp(8px,2cqw,16px)]">
                <MagazineInput
                  placeholder="Username"
                  index={1}
                  value={registerForm.username}
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
                  placeholder="Password again"
                  index={4}
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={updateRegisterField("confirmPassword")}
                />
                {registerError && (
                  <p
                    className={`${typography.feedback} ${colors.feedback.error} ${spacing.feedback}`}
                  >
                    {registerError}
                  </p>
                )}
                {registerSuccess && (
                  <p
                    className={`${typography.feedback} ${colors.feedback.success} ${spacing.feedback}`}
                  >
                    {registerSuccess}
                  </p>
                )}
              </div>

              <button
                onClick={handleRegister}
                className={`${typography.buttonAuth} ${colors.text.charcoal} pb-2`}
              >
                Join →
              </button>
            </div>
          }
          right={
            <div
              className={`${colors.bg.earth} flex flex-col justify-between h-full p-[clamp(8px,2cqw,16px)]`}
            >
              <div className="flex flex-col justify-center flex-1 space-y-[clamp(8px,2cqw,16px)]">
                <MagazineInput
                  placeholder="Email/username"
                  type="text"
                  index={1}
                  value={loginForm.identifier}
                  onChange={updateLoginField("identifier")}
                />
                <MagazineInput
                  placeholder="Password"
                  type="password"
                  index={2}
                  value={loginForm.password}
                  onChange={updateLoginField("password")}
                />
                {loginError && (
                  <p
                    className={`${typography.feedback} ${colors.feedback.error} ${spacing.feedback}`}
                  >
                    {loginError}
                  </p>
                )}
              </div>

              <button
                onClick={handleLogin}
                disabled={isSubmitting}
                className={`${typography.buttonAuth} ${colors.text.charcoal} pb-2`}
              >
                Enter →
              </button>
            </div>
          }
        />
      </div>
    </BookLayout>
  );
}