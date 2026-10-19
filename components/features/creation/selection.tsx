"use client";
/*TYPES*/
import type { OnNavigate, NavigationParams } from "@/types/navigation";
/* COMPONENTS */
import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import Header from "@/components/navigation/Header";
import FourSquaresGrid from "@/components/ui/grids/FourSquareGrid";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
/*LAYOUT*/
import LayoutAPreview from "./layouts/previews/LayoutAPreview";
import LayoutBPreview from "./layouts/previews/LayoutBPreview";
import LayoutCPreview from "./layouts/previews/LayoutCPreview";
import LayoutDPreview from "./layouts/previews/LayoutDPreview";
/* STYLE */
import { typography } from "@/styles/typography";
import BackButton from "@/components/ui/buttons/BackButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { colors } from "@/styles/colors";

type Props = {
  onNavigate: OnNavigate;
  params?: NavigationParams["params"] | null;
  onBack?: () => void;
};

export default function Create({ onNavigate, params, onBack }: Props) {
  const { user: currentUser } = useCurrentUser();

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
              clickable: false,
              active: true,
            },
          ]}
        />
      }
      sidebar={<Sidebar text="EDITION" clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2">
          <p className={typography.buttonBodyFocus}>layout</p>
          <span className={typography.bullet}>•</span>
          <p className={typography.buttonBodyFocus}>foundation</p>
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
      <FourSquaresGrid
        topLeft={
          <button
            type="button"
            aria-label="Choose layout A"
            className="h-full w-full cursor-pointer appearance-none border-0 p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  layout: "A",
                },
              })
            }
          >
            <div className={`w-full h-full overflow-hidden ${colors.bg.ivory}`}>
              <LayoutAPreview />
            </button>
          </div>
        }
        topRight={
          <button
            type="button"
            aria-label="Choose layout B"
            className="h-full w-full cursor-pointer appearance-none border-0 p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  layout: "B",
                },
              })
            }
          >
            <div className={`w-full h-full overflow-hidden ${colors.bg.ivory}`}>
              <LayoutBPreview />
            </button>
          </div>
        }
        bottomLeft={
          <button
            type="button"
            aria-label="Choose layout C"
            className="h-full w-full bg-zinc-400 hover:bg-zinc-500 transition appearance-none border-0 p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  layout: "C",
                },
              })
            }
          >
            <div className={`w-full h-full overflow-hidden ${colors.bg.ivory}`}>
              <LayoutCPreview />
            </button>
          </div>
        }
        bottomRight={
          <button
            type="button"
            aria-label="Choose layout D"
            onClick={() =>
              onNavigate({
                to: "editor",
                direction: "next",
                params: {
                  layout: "D",
                },
              })
            }
            className="h-full w-full cursor-pointer appearance-none border-0 p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black"
          >
            <div className={`w-full h-full overflow-hidden ${colors.bg.ivory}`}>
              <LayoutDPreview />
            </button>
          </div>
        }
      />
    </BookLayout>
  );
}
