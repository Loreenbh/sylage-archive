"use client";
import { useRef, useState } from "react";
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

async function renderLookToPng(
  element: HTMLDivElement,
  slot: Exclude<MoodboardSlot, null>,
): Promise<string> {
  const image = new Image();
  image.src = slot.url;

  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Impossible de charger l’image du look"));
    });
  }

  if (image.decode) {
    await image.decode();
  }

  const rect = element.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  if (!width || !height || !image.naturalWidth || !image.naturalHeight) {
    throw new Error("Dimensions invalides pour l’export du look");
  }

  const canvas = document.createElement("canvas");
  const pixelRatio = 2;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Impossible de préparer l’export du look");
  }

  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = "#BBA99E";
  context.fillRect(0, 0, width, height);

  const coverScale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );
  const drawWidth = image.naturalWidth * coverScale;
  const drawHeight = image.naturalHeight * coverScale;
  const overflowX = Math.max(0, (drawWidth - width) / 2);
  const overflowY = Math.max(0, (drawHeight - height) / 2);
  const imageOffsetX = Math.max(
    -overflowX * slot.scale,
    Math.min(overflowX * slot.scale, slot.offsetX),
  );
  const imageOffsetY = Math.max(
    -overflowY * slot.scale,
    Math.min(overflowY * slot.scale, slot.offsetY),
  );
  const translateX = slot.offsetX - imageOffsetX;
  const translateY = slot.offsetY - imageOffsetY;
  const objectPositionX = overflowX
    ? 50 - (imageOffsetX / slot.scale / overflowX) * 50
    : 50;
  const objectPositionY = overflowY
    ? 50 - (imageOffsetY / slot.scale / overflowY) * 50
    : 50;
  const imageX = (width - drawWidth) * (objectPositionX / 100);
  const imageY = (height - drawHeight) * (objectPositionY / 100);

  context.save();
  context.beginPath();
  context.rect(0, 0, width, height);
  context.clip();
  context.translate(width / 2 + translateX, height / 2 + translateY);
  context.scale(slot.scale, slot.scale);
  context.drawImage(
    image,
    imageX - width / 2,
    imageY - height / 2,
    drawWidth,
    drawHeight,
  );
  context.restore();

  return canvas.toDataURL("image/png");
}

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
      setPublishError("Ce moodboard est introuvable. Réessaie.");
      return;
    }

    const slotElement = slotRef.current;

    if (!slotElement) {
      setPublishError("Impossible de préparer ce look. Réessaie.");
      return;
    }

    setIsPublishing(true);

    try {
      slotElement.classList.add("export-mode");

      // Render the image directly to canvas to avoid blank html-to-image exports on mobile.
      const imageData = await renderLookToPng(slotElement, silhouette);
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
      console.error("Unable to publish look:", error);
      setPublishError("Impossible de publier ce look. Réessaie.");
    } finally {
      slotElement.classList.remove("export-mode");
      setIsPublishing(false);
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
      sidebar={<Sidebar text={"ADD LOOK"} clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-3">
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
              {isPublishing ? "Publishing…" : "Publish"}
            </button>

            {publishError && (
              <p
                role="alert"
                className={`text-[10px] md:text-[11px] ${colors.feedback.error} tracking-[0.04em]`}
              >
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
