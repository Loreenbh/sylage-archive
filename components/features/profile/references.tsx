"use client";
import type { OnNavigate } from "@/types/navigation";

import BookLayout from "@/components/book/BookLayout";
import Sidebar from "@/components/navigation/SideBar";
import Header from "@/components/navigation/Header";
import LovesGrid from "@/components/ui/grids/LovesGrid";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import BackButton from "@/components/ui/buttons/BackButton";
import { NavigationParams } from "@/types/navigation";
import { useReferences } from "@/hooks/useReferences";

import { typography } from "@/styles/typography";
import Avatar from "@/components/ui/pagination/Avatar";

type Props = {
  params?: NavigationParams["params"] | null;
  onNavigate: OnNavigate;
  onBack?: () => void;
};

export default function References({ onNavigate, onBack, params }: Props) {
  const { user: currentUser } = useCurrentUser();
  const { isOwner, userId, from } = params ?? {};
  const { references, isLoading } = useReferences();

  const latestLooks = references?.looks?.slice(0, 3);
  const latestMoods = references?.moods?.slice(0, 3);
  const featuredCreator = references?.muse;

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
                }),
            },
          ]}
        />
      }
      sidebar={<Sidebar text="REFERENCES" clickable={false} />}
      actionsBar={
        <div className="flex items-center gap-2 md:gap-4 ml-6 mt-1 lg:mt-3">
          <p className={typography.buttonBody}>Your references</p>
          <span className={typography.bullet}>•</span>
          <p className={typography.buttonBody}>Favourites</p>
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
      <div className="flex flex-col h-full min-h-0 gap-1">
        <LovesGrid
          left={
            <button
              disabled={!latestLooks?.[0]}
              onClick={() =>
                latestLooks?.[0] &&
                onNavigate?.({
                  to: "looks",
                  direction: "next",
                  params: {
                    from: "references",
                    isOwner: true,
                  },
                })
              }
              className="
                relative
                h-full
                w-full
                overflow-hidden
                text-left
                border
                border-black/10
              "
            >
              {latestLooks?.[0] && (
                <img
                  src={latestLooks[0].image_url}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-contain
                  "
                />
              )}

              {!latestLooks?.[0] && (
                <div
                  className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                "
                >
                  <p className="text-[10px] tracking-[0.2em] text-black/30">
                    NO LOOKS YET
                  </p>
                </div>
              )}

              <div
                className="
                absolute
                bottom-0
                left-0
                p-4
                text-black
              "
              >
                <p className={typography.buttonBody}>LOOKS</p>
              </div>
            </button>
          }
          topRight={
            <button
              disabled={!latestMoods?.[0]}
              onClick={() =>
                latestMoods?.[0] &&
                onNavigate?.({
                  to: "moods",
                  direction: "next",
                  params: {
                    from: "references",
                    isOwner: true,
                  },
                })
              }
              className="
                relative
                h-full
                w-full
                overflow-hidden
                text-left
                border
                border-black/10
              "
            >
              {latestMoods?.[0] && (
                <img
                  src={latestMoods[0].image_url}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                  "
                />
              )}

              {!latestMoods?.[0] && (
                <div
                  className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                "
                >
                  <p className="text-[10px] tracking-[0.2em] text-black/30">
                    NO MOODS YET
                  </p>
                </div>
              )}

              <div
                className="
                absolute
                bottom-0
                left-0
                p-4
                text-black
              "
              >
                <p className={typography.buttonBody}>MOODS</p>
              </div>
            </button>
          }
          bottomRight={
            <button
              disabled={!featuredCreator}
              onClick={() => {
                if (featuredCreator) {
                  onNavigate?.({
                    to: "profile",
                    direction: "next",
                    params: {
                      userId: featuredCreator.id,
                      isOwner: false,
                      from: "references",
                    },
                  });
                }
              }}
              className="
                relative
                h-full
                w-full
                overflow-hidden
                text-left
                border
                border-black/10
              "
            >
              {featuredCreator ? (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    items-center
                    justify-center
                    -translate-y-4
                  "
                >
                  <p
                    className="
                      text-[7px]
                      mb-2
                      tracking-[0.4em]
                      uppercase
                      text-black/30
                      sm:text-[12px]
                      sm:mb-4
                      lg:text-[15px]
                    "
                  >
                    {featuredCreator.username}
                  </p>

                  <Avatar
                    user={featuredCreator}
                    className="
                        w-16
                        h-16
                        sm:w-[140px]
                        sm:h-[140px]
                        lg:w-[220px]
                        lg:h-[220px]
                        text-[12px]
                        md:text-[25px]
                        lg:text-[40px]
                      "
                  />
                </div>
              ) : (
                <div
                  className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                "
                >
                  <p className="text-[10px] tracking-[0.2em] text-black/30">
                    NO CREATOR YET
                  </p>
                </div>
              )}

              <div
                className="
                absolute
                bottom-0
                left-0
                p-4
              "
              >
                <p className={`${typography.buttonBody}`}>CREATOR</p>
              </div>
            </button>
          }
        />
      </div>
    </BookLayout>
  );
}
