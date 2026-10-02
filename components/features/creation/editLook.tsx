"use client";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
/*COMPONENTS*/
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import Header from "@/components/navigation/Header";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import ImageSlot from "./layouts/ImageSlot";
import BackButton from "@/components/ui/buttons/BackButton";
/*STYLE*/
import { typography } from "@/styles/typography";
/*TYPES*/
import type { OnNavigate, NavigationParams } from "@/types/navigation";
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/editor";
/*SERVICES*/
import { uploadImage } from "@/lib/services/upload";
import { createSilhouette } from "@/lib/services/silhouette";
/* HOOKS */
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMoodboard } from "@/hooks/useMoodboard";
import { colors } from "@/styles/colors";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

function SilhouetteGhost({ slot }: { slot: MoodboardSlot }) {
  if (!slot) return null;

  return (
    <img
      src={slot.url}
      draggable={false}
      style={{
        transform: `
          translate(${slot.offsetX}px, ${slot.offsetY}px)
          scale(${slot.scale})
        `,
      }}
      className="
        absolute inset-0 
        w-full h-full 
        object-cover 
        opacity-20 
        pointer-events-none 
        select-none
      "
    />
  );
}

export default function EditLook({ onNavigate, params, onBack }: Props) {
  const { user: currentUser } = useCurrentUser();

  const { moodboardId, fromTab, isOwner } = params ?? {};

  const [silhouette, setSilhouette] = useState<MoodboardSlot>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const { moodboard } = useMoodboard(moodboardId);
  const handleSelectSlot = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const url = reader.result as string;
      setSilhouette({
        url,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      });
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleChangeTransform = (patch: MoodboardSlotPatch) => {
    setSilhouette((prev) =>
      prev
        ? {
          ...prev,
          ...patch,
        }
        : prev,
    );
  };

  const handlePublish = async () => {
    setPublishError(null);

    if (!silhouette) {
      setPublishError("Ajoute une image avant de publier");
      return;
    }

    if (!moodboardId) {
      setPublishError("Erreur interne : moodboard introuvable");
      return;
    }

    if (!slotRef.current) {
      setPublishError("Erreur interne : silhouette introuvable");
      return;
    }

    setIsPublishing(true);

    try {
      slotRef.current.classList.add("export-mode");

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      const imageData = await toPng(slotRef.current, { cacheBust: true });

      slotRef.current.classList.remove("export-mode");

      const imageUrl = await uploadImage(imageData);

      await createSilhouette(imageUrl, moodboardId);

      onNavigate?.({
        to: "moodDetails",
        direction: "prev",
        params: {
          isOwner,
          moodboardId,
          fromTab,
        },
      });
    } catch (error) {
      console.error(error);
      setPublishError(
        error instanceof Error ? error.message : "Erreur inconnue",
      );
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
                  params: {
                    isOwner: false,
                  },
                }),
            },
            {
              section: "FILTER",
              clickable: false,
            },
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
      sidebar={<Sidebar text={"LOOK IN"} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-3 ml-6 md:mt-2 mt-1">
          <span className={typography.buttonBodyFocus}>
            {moodboard?.silhouettes_count ?? 0} LOOKS
          </span>

          <span className={typography.bullet}>•</span>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`
                ${typography.buttonBodyFocus}
                transition-opacity
                hover:opacity-40
                disabled:opacity-40
                cursor-pointer
              `}
            >
              Publish
            </button>

            {publishError && (
              <p className="text-[10px] md:text-[11px] text-red-600 tracking-[0.1em]">
                {publishError}
              </p>
            )}
          </div>
        </div>
      }
      footerLeft={<BackButton onBack={onBack} />}
      footerRight={
        <div className="flex items-center gap-4">
          <span className={typography.username}>{currentUser?.username}</span>
          <ProfileButton onNavigate={onNavigate} />
        </div>
      }
    >
      <div
        className={`
        flex
        items-stretch
        w-full
        h-full
        gap-1
        ${colors.bg.empty}
        border
        border-black/10
      `}
      >
        <div
          className="
          relative
          overflow-hidden
          w-1/4
        "
        >
          <SilhouetteGhost slot={silhouette} />
        </div>

        <div
          ref={slotRef}
          className="
            relative
            overflow-hidden
            w-1/2
          "
        >
          <ImageSlot
            slot={silhouette}
            onSelect={handleSelectSlot}
            onChangeTransform={handleChangeTransform}
            className={`${colors.bg.ivory}`}
          />
        </div>

        <div
          className="
          relative
          overflow-hidden
          w-1/4
        "
        >
          <SilhouetteGhost slot={silhouette} />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </BookLayout>
  );
}
