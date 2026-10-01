"use client";
import type { OnNavigate } from "@/types/navigation";
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import TwoColGrid from "@/components/ui/grids/TwoColGrid";
import Header from "@/components/navigation/Header";
/* STYLE */
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";
/*HOOKS*/
import { useAuthForm } from "@/hooks/useAuthForm";
/*TYPES*/
type Props = {
  onNavigate: OnNavigate;
};

type Props1 = {
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
}: Props1) {
  return (
    <div className="w-full flex sm:space-y-4 sm:px-3 lg:px-8">
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
            sm:text-[10px] md:text-base lg:text-[18px] 
            font-light 
            outline-none
            ${colors.input.placeholder}
            focus:border-black/30
            transition-colors duration-200
          `}
      />
      <span
        className={`
            pl-2 sm:text-[18px] md:text-[63px] lg:text-[90px] 
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
            mt-1
            ml-7
            sm:gap-1
            w-[130%]
            ${colors.text.charcoal}
          `}
        >
          <button
            onClick={() =>
              onNavigate({
                to: "forgot",
                direction: "next",
              })
            }
            className={`${typography.buttonBodyFocus} ${colors.text.charcoal}`}
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
            className={`${typography.buttonBodyFocus} ${colors.text.charcoal}`}
          >
            Guest Access
          </button>
        </div>
      }
    >
      <div className="flex flex-col h-full ">
        <TwoColGrid
          left={
            <div
              className={`${colors.bg.stone} flex flex-col justify-between h-full`}
            >
              <div className="sm:pt-5 lg:pt-43">
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
                    className={`
                  ${typography.feedback} 
                  ${colors.feedback.error}
                  ${spacing.feedback}
                  `}
                  >
                    {registerError}
                  </p>
                )}
                {registerSuccess && (
                  <p
                    className={`
                  ${typography.feedback} 
                  ${colors.feedback.success} 
                  ${spacing.feedback}
                  `}
                  >
                    {registerSuccess}
                  </p>
                )}
              </div>

              <button
                onClick={handleRegister}
                className={`${typography.buttonAuth} ${colors.text.charcoal} pb-5`}
              >
                Join →
              </button>
            </div>
          }
          right={
            <div
              className={`${colors.bg.earth} flex flex-col justify-between h-full`}
            >
              <div className="sm:pt-15 md:pt-51 lg:pt-65">
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
                    className={`
                  ${typography.feedback} 
                  ${colors.feedback.error}
                  ${spacing.feedback}  
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
                ${typography.buttonAuth} 
                ${colors.text.charcoal} pb-5 `}
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
