"use client";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { MIN_TAGS_TOTAL } from "@/constants/tags";
/*TYPES*/
import type { OnNavigate, NavigationParams } from "@/types/navigation";
import type { MoodboardSlot, MoodboardSlotPatch } from "@/types/editor";
/*COMPONENTS*/
import TagPicker from "@/components/filters/TagPicker";
import BookLayout from "@/components/book/BookLayout";
import Header from "@/components/navigation/Header";
import Sidebar from "@/components/navigation/SideBar";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import BackButton from "@/components/ui/buttons/BackButton";
/*LAYOUT*/
import LayoutA from "./layouts/LayoutA";
import LayoutB from "./layouts/LayoutB";
import LayoutC from "./layouts/LayoutC";
import LayoutD from "./layouts/LayoutD";
/*STYLE*/
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
/*SERVICES*/
import { uploadImage } from "@/lib/services/upload";
import { createMoodboard } from "@/lib/services/moodboard";
/*HOOKS*/
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

const LAYOUT_SLOT_COUNT = {
  A: 9,
  B: 7,
  C: 6,
  D: 6,
} as const;

const EXPORT_SIZE = 1200;

export default function Editor({ onNavigate, params, onBack }: Props) {
  const { user: currentUser } = useCurrentUser();

  const layout = params?.layout as keyof typeof LAYOUT_SLOT_COUNT;
  const slotCount = LAYOUT_SLOT_COUNT[layout] ?? 9;

  const [slots, setSlots] = useState<MoodboardSlot[]>(
    Array(slotCount).fill(null),
  );

  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [ambianceTags, setAmbianceTags] = useState<string[]>([]);
  const [colorTags, setColorTags] = useState<string[]>([]);

  const [step, setStep] = useState<"compose" | "filters">("compose");

  const [exportedImage, setExportedImage] = useState<string | null>(null);

  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeSlotRef = useRef<number | null>(null);

  const layoutRef = useRef<HTMLDivElement | null>(null);

  const handleSlotClick = (index: number) => {
    activeSlotRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const slot = activeSlotRef.current;

    if (!file || slot === null) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setSlots((prev) => {
        const copy = [...prev];
        copy[slot] = {
          url,
          scale: 1,
          offsetX: 0,
          offsetY: 0,
        };
        return copy;
      });
    };

    reader.readAsDataURL(file);
    activeSlotRef.current = null;
    e.target.value = "";
  };

  const handleUpdateSlot = (index: number, patch: MoodboardSlotPatch) => {
    setSlots((prev) => {
      const current = prev[index];
      if (!current) return prev;
      const copy = [...prev];
      copy[index] = {
        ...current,
        ...patch,
      };
      return copy;
    });
  };

  const allSelectedTags = [...styleTags, ...ambianceTags, ...colorTags];

  const canPublish = allSelectedTags.length >= MIN_TAGS_TOTAL;

  const handleConfirm = async () => {
    setPublishError(null);

    if (!layoutRef.current) {
      setPublishError("Moodboard unavailable");
      return;
    }
    try {
      setIsPublishing(true);
      layoutRef.current.classList.add("export-mode");
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      const layoutBounds = layoutRef.current.getBoundingClientRect();
      if (!layoutBounds.width || !layoutBounds.height) {
        throw new Error("Moodboard dimensions unavailable");
      }

      const imageData = await toPng(layoutRef.current, {
        cacheBust: true,
        width: layoutBounds.width,
        height: layoutBounds.height,
      });

      const imgUrl = await uploadImage(imageData);
      setExportedImage(imgUrl);
      setStep("filters");
    } catch (error) {
      console.error(error);
      setPublishError("Export error");
    } finally {
      layoutRef.current?.classList.remove("export-mode");
      setIsPublishing(false);
    }
  };

  const handlePublish = async () => {
    setPublishError(null);
    if (!canPublish) {
      setPublishError(`Choisis au moins ${MIN_TAGS_TOTAL} tags`);
      return;
    }

    if (!exportedImage) {
      setPublishError("Confirme d'abord le moodboard");
      return;
    }

    try {
      setIsPublishing(true);
      await createMoodboard(exportedImage, allSelectedTags);

      onNavigate({
        to: "discover",
        direction: "prev",
      });
    } catch (error) {
      console.error(error);
      setPublishError("Erreur réseau");
    } finally {
      setIsPublishing(false);
    }
  };

  const renderLayout = () => {
    const props = {
      images: slots,
      onSelectSlot: handleSlotClick,
      onUpdateSlot: handleUpdateSlot,
    };

    switch (layout) {
      case "A":
        return <LayoutA {...props} />;
      case "B":
        return <LayoutB {...props} />;
      case "C":
        return <LayoutC {...props} />;
      case "D":
        return <LayoutD {...props} />;
      default:
        return null;
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
                onNavigate({
                  to: "discover",
                  direction: "prev",
                }),
            },
            {
              section: "FILTER",
              clickable: false,
            },
            {
              section: "CREATE",
              clickable: true,
              active: true,
            },
          ]}
        />
      }
      sidebar={<Sidebar text="COMPOSE" clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2">
          {step === "compose" ? (
            <button
              onClick={handleConfirm}
              disabled={!slots.every((slot) => slot !== null) || isPublishing}
              className={`${typography.buttonBodyFocus} disabled:opacity-40`}
            >
              confirm
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={!canPublish || isPublishing}
              className={`${typography.buttonBodyFocus} disabled:opacity-40`}
            >
              publish
            </button>
          )}
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
      <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
        <div
          ref={layoutRef}
          className="
        aspect-square
        h-full
        max-w-full
        overflow-hidden
        relative
        "
        >
          {renderLayout()}
        </div>
        {publishError && (
          <p className={`${colors.feedback.error} text-[10px]`}>
            {publishError}
          </p>
        )}
        {step === "filters" && (
          <div
            className="
              flex
              flex-col
              items-center
              sm:px-4
              sm:pt-2
              max-h-[40%]
              shrink-0
              min-h-0
              overflow-y-auto
              pb-1
            "
          >
            <TagPicker
              styleTags={styleTags}
              ambianceTags={ambianceTags}
              colorTags={colorTags}
              onChangeStyle={setStyleTags}
              onChangeAmbiance={setAmbianceTags}
              onChangeColor={setColorTags}
            />

            <p className="mt-1 tracking-[0.12em] sm:text-[7px] md:text-[8px] lg:text-[14px] uppercase text-black/50 shrink-0">
              {allSelectedTags.length} tags selected
            </p>
          </div>
        )}
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
