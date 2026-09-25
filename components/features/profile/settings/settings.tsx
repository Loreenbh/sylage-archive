"use client";
import { useState, useEffect } from "react";
import type { OnNavigate, NavigationParams } from "@/types/navigation";

import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import Header from "@/components/navigation/Header";
import FourSquaresGrid from "@/components/ui/grids/FourSquareGrid";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { uploadImage } from "@/lib/services/upload";
import { updateUser, deleteUser } from "@/lib/services/profile";

import { typography } from "@/styles/typography";
import Avatar from "@/components/ui/pagination/Avatar";
import BackButton from "@/components/ui/buttons/BackButton";
import { colors } from "@/styles/colors";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
}

export default function Settings({ onNavigate, onBack }: Props) {
  const { user } = useCurrentUser();
  const [avatar, setAvatar] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      setDeleteMessage("Account deleted");
      onNavigate?.({
        to: "cover",
        direction: "prev",
      });
    } catch (error) {
      if (error instanceof Error) {
        setDeleteMessage(error.message);
      } else {
        setDeleteMessage("Delete failed");
      }
    }
  };

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar_url ?? null);
      setUsername(user.username);
    }
  }, [user]);

  const handleUsernameChange = async () => {
    setUsernameMessage("");
    if (!username) {
      setUsernameMessage("Missing username");
      return;
    }
    if (username.length < 3) {
      setUsernameMessage("Username must be at least 3 characters");
      return;
    }
    if (username.length > 20) {
      setUsernameMessage("Username must be less than 20 characters");
      return;
    }

    try {
      await updateUser({
        username,
      });
      setUsernameMessage("Updated.");
    } catch (error) {
      if (error instanceof Error) {
        setUsernameMessage(error.message);
      }
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageData = await fileToBase64(file);
      const imageUrl = await uploadImage(imageData);
      await updateUser({
        avatar_url: imageUrl,
      });
      setAvatar(imageUrl);
    } catch (error) {
      console.error("Erreur changement avatar", error);
    }
  };

  const handlePasswordChange = async () => {
    setMessage("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Missing fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    try {
      await updateUser({
        oldPassword,
        password: newPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Password update failed");
      }
    }
  };
  return (
    <BookLayout
      header={
        <Header
          items={[
            {
              section: "HOME",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "discover",
                  direction: "prev",
                }),
            },
            { section: "FILTER", clickable: false },
            {
              section: "CREATE",
              clickable: true,
              onClick: () =>
                onNavigate?.({
                  to: "create",
                  direction: "next",
                  params: {
                    from: "discover",
                  },
                }),
            },
          ]}
        />
      }
      sidebar={<Sidebar text="SETTINGS" clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2 md:gap-4 ml-6 mt-1 lg:mt-3">
          <button
            onClick={() =>
              onNavigate?.({
                to: "about",
                direction: "next",
              })
            }
            className={typography.buttonBody}
          >
            ABOUT
          </button>

          <span className={typography.bullet}>•</span>

          <button
            onClick={() =>
              onNavigate?.({
                to: "privacy",
                direction: "next",
              })
            }
            className={typography.buttonBody}
          >
            privacy & terms
          </button>
        </div>
      }
      footerLeft={<BackButton onBack={onBack} />}
    >
      <FourSquaresGrid
        topLeft={
          <label
            className="
              relative
              h-full
              w-full
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
                  avatar_url: avatar,
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
              className={`
                ${typography.buttonBody}
                relative
                z-10
                drop-shadow
              `}
            >
              Portrait
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
            className={`
              h-full
              w-full
              ${colors.bg.stone}
              flex
              flex-col
              justify-between
              p-2
              sm:p-3
              md:p-4
              lg:p-5
              cursor-pointer
            `}
            onClick={() => !passwordOpen && setPasswordOpen(true)}
          >
            {!passwordOpen ? (
              <div />
            ) : (
              <div
                className="
                  w-full
                  h-full
                  flex
                  flex-col
                  items-center
                  justify-center
                "
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="
                    w-full
                    max-w-[140px]
                    sm:max-w-[180px]
                    md:max-w-[200px]
                    lg:max-w-[300px]
                    flex
                    flex-col
                    items-center
                    gap-1
                    sm:gap-2
                    md:gap-2
                    lg:gap-6
                  "
                >
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="current password"
                    className="
                      w-full
                      bg-transparent
                      border-b
                      border-black/30
                      outline-none
                      text-[8px]
                      sm:text-[14px]
                      md:text-[16px]
                      lg:text-[18px]
                      lg:pt-8
                      tracking-wide
                      text-center
                    "
                  />

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="new password"
                    className="
                      w-full
                      bg-transparent
                      border-b
                      border-black/30
                      outline-none
                      text-[8px]
                      sm:text-[14px]
                      md:text-[16px]
                      lg:text-[18px]
                      tracking-wide
                      text-center
                    "
                  />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="confirm password"
                    className="
                      w-full
                      bg-transparent
                      border-b
                      border-black/30
                      outline-none
                      text-[8px]
                      sm:text-[14px]
                      md:text-[16px]
                      lg:text-[18px]
                      tracking-wide
                      text-center
                    "
                  />

                  <button
                    className={`
                      ${typography.buttonBody}
                      mt-1
                      sm:mt-2
                      lg:mt-3
                    `}
                    onClick={handlePasswordChange}
                  >
                    save
                  </button>

                  {message && (
                    <span
                      className="
                        text-[7px]
                        sm:text-[8px]
                        md:text-[9px]
                        lg:text-[10px]
                        opacity-60
                        tracking-wide
                        text-center
                      "
                    >
                      {message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {!passwordOpen && (
              <span className={typography.buttonBody}>Password</span>
            )}
          </div>
        }
        bottomLeft={
          <div
            className={`
              h-full w-full
              ${colors.bg.earth}
              flex flex-col
              p-4
              cursor-pointer
              ${usernameOpen ? "items-center justify-center" : "justify-end"}
            `}
            onClick={() => !usernameOpen && setUsernameOpen(true)}
          >
            {!usernameOpen ? (
              <span className={typography.buttonBody}>Name</span>
            ) : (
              <div
                className="
                  w-full
                  max-w-[140px]
                  sm:max-w-[180px]
                  md:max-w-[200px]
                  lg:max-w-[300px]
                  flex flex-col
                  items-center
                  gap-5
                "
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="new username"
                  className="
                    w-full
                    bg-transparent
                    border-b
                    border-black/30
                    outline-none
                    text-[10px]
                    sm:text-[16px]
                    lg:text-[18px]
                    tracking-wide
                    text-center
                  "
                />

                <button
                  className={typography.buttonBody}
                  onClick={handleUsernameChange}
                >
                  save
                </button>

                {usernameMessage && (
                  <span className="text-[9px] opacity-60 tracking-wide text-center">
                    {usernameMessage}
                  </span>
                )}
              </div>
            )}
          </div>
        }
        bottomRight={
          <div
            className={`
            h-full w-full
            ${colors.bg.empty}
            flex flex-col
            p-4
            cursor-pointer
            ${deleteConfirm ? "items-center justify-center" : "justify-end"}
          `}
            onClick={() => !deleteConfirm && setDeleteConfirm(true)}
          >
            {!deleteConfirm ? (
              <span className={typography.buttonBody}>Account</span>
            ) : (
              <div
                className="
                flex flex-col
                items-center
                justify-center
                gap-6
                text-center
              "
                onClick={(e) => e.stopPropagation()}
              >
                <span className={typography.buttonBody}>Remove account?</span>

                <div className="flex gap-[40px] sm:gap-[50px] md:gap-[60px] lg:gap-[80px]">
                  <button
                    onClick={handleDeleteAccount}
                    className={typography.buttonBody}
                  >
                    ✓
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className={typography.buttonBody}
                  >
                    x
                  </button>
                </div>

                {deleteMessage && (
                  <span className="text-xs opacity-60 tracking-wide">
                    {deleteMessage}
                  </span>
                )}
              </div>
            )}
          </div>
        }
      />
    </BookLayout>
  );
}
