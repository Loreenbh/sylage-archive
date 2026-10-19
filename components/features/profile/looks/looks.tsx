"use client";
import { useState } from "react";
/* TYPES */
import type { OnNavigate, NavigationParams } from "@/types/navigation";
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import Header from "@/components/navigation/Header";
import ThreeColGrid from "@/components/ui/grids/ThreeColGrid";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import CarouselControls from "@/components/ui/navigation/CarouselControls";
import SilhouetteCell from "./SilhouetteCell";
import BackButton from "@/components/ui/buttons/BackButton";
/*STYLE*/
import { typography } from "@/styles/typography";
import { colors } from "@/styles/colors";
/*HOOKS*/
import { useLooksCarousel } from "@/hooks/useLooksCarousel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSilhouettes } from "@/hooks/useSilhouettes";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

export default function Looks({ onNavigate, onBack, params }: Props) {
  const { userId, isOwner, moodboardId, from } = params ?? {};
  const {
    silhouettes,
    isLoading,
    user: profileUser,
    setSilhouettes,
  } = useSilhouettes(userId, moodboardId, from);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { user: currentUser } = useCurrentUser();

  const carouselLabel =
    from === "references"
      ? "LIKED LOOKS"
      : moodboardId && isOwner
        ? "FOR ME"
        : moodboardId
          ? `FOR ${profileUser?.username}`
          : `BY ${profileUser?.username}`;

  const filteredSilhouettes =
    moodboardId || selectedFilters.length === 0
      ? silhouettes
      : silhouettes.filter((silhouette) =>
          silhouette.tags?.some((tag) => selectedFilters.includes(tag)),
        );

  const {
    left,
    center,
    right,
    currentItem,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
  } = useLooksCarousel(filteredSilhouettes);

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/silhouettes?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setSilhouettes((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <BookLayout
      header={
        <Header
          onFiltersChange={setSelectedFilters}
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
              clickable: !moodboardId,
            },
            {
              section: "CREATE",
              clickable: !!currentUser,
              onClick: currentUser
                ? () =>
                    onNavigate?.({
                      to: "create",
                      direction: "next",
                      params: {
                        from: "discover",
                      },
                    })
                : undefined,
            },
          ]}
        />
      }
      sidebar={<Sidebar text="LOOKS" clickable={false} />}
      actionsBar={
        <div className="flex w-full min-w-0 items-center justify-between gap-1 whitespace-nowrap">
          <span
            className={`
              ${typography.buttonBodyFocus}
              min-w-0
              max-w-[45%]
              truncate
              whitespace-nowrap
              flex-1
            `}
          >
            {carouselLabel}
          </span>

          <span
            className={`
              ${typography.buttonBodyFocus}
              shrink-0
              whitespace-nowrap
              min-w-max
            `}
          >
            {String(currentItem).padStart(2, "0")} /{" "}
            {String(filteredSilhouettes.length).padStart(2, "0")}
          </span>

          <div className="shrink-0 whitespace-nowrap">
            <CarouselControls
              onPrev={handlePrev}
              onNext={handleNext}
              canPrev={canPrev}
              canNext={canNext}
            />
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
        className="
          flex 
          flex-col 
          h-full 
          min-h-0 
          gap-1"
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-black/30 text-xs tracking-[0.2em]">...</p>
          </div>
        ) : filteredSilhouettes.length === 0 ? (
          <div
            className={`
            h-full 
            flex 
            items-center 
            justify-center
            ${colors.bg.empty}
            border -b 
            border-black/30`}
          >
            <p
              className="
            text-black/30 
            text-[clamp(5px,1.1cqw,8px)]
            sm:text-[10px]
            md:text-[11px]
            lg:text-[14px]
            xl:text-[18px]
            tracking-[0.2em]"
            >
              NO LOOKS.
            </p>
          </div>
        ) : (
          <ThreeColGrid
            left={
              <SilhouetteCell
                silhouette={left}
                currentUser={currentUser?.id}
                moodboardId={moodboardId}
                from={from}
                onNavigate={onNavigate}
                onDelete={handleDelete}
                currentUserRole={currentUser?.role}
              />
            }
            center={
              <SilhouetteCell
                silhouette={center}
                currentUser={currentUser?.id}
                moodboardId={moodboardId}
                from={from}
                onNavigate={onNavigate}
                onDelete={handleDelete}
                currentUserRole={currentUser?.role}
              />
            }
            right={
              <SilhouetteCell
                silhouette={right}
                currentUser={currentUser?.id}
                moodboardId={moodboardId}
                from={from}
                onNavigate={onNavigate}
                onDelete={handleDelete}
                currentUserRole={currentUser?.role}
              />
            }
          />
        )}
      </div>
    </BookLayout>
  );
}
