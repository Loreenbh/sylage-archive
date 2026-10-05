"use client";
import { useState, useEffect } from "react";
import type { PageName } from "@/types/pages";
import type { NavigationParams } from "@/types/navigation";
/*COMPONENTS*/
import PageFlip from "./PageFlip";
/*PAGES*/
import Cover from "../features/cover/cover";
import Authentification from "../features/auth/auth";
import Discover from "../features/discover/discover";
import ProfilePage from "../features/profile/profile";
import Looks from "../features/profile/looks/looks";
import References from "../features/profile/references";
import Settings from "../features/profile/settings/settings";
import Moods from "../features/profile/moods";
import MoodDetails from "../features/discover/focus";
import Create from "../features/creation/selection";
import Editor from "../features/creation/editMood";
import Draw from "../features/creation/editLook";
import ForgotPassword from "../features/forgot-pswd/forgotPassword";
import UpdatePassword from "../features/update-pswd/page";
import About from "../features/profile/settings/about";
import Privacy from "../features/profile/settings/privacy";

import { useCurrentUser } from "@/hooks/useCurrentUser";

type HistoryItem = {
  page: PageName;
  params: NavigationParams["params"] | null;
};

const PAGES = {
  cover: Cover,
  auth: Authentification,
  discover: Discover,
  profile: ProfilePage,
  looks: Looks,
  references: References,
  settings: Settings,
  moods: Moods,
  moodDetails: MoodDetails,
  create: Create,
  editor: Editor,
  draw: Draw,
  forgot: ForgotPassword,
  about: About,
  privacy: Privacy,
  update: UpdatePassword,
} as const;

export default function Book() {
  const [current, setCurrent] = useState<PageName>("discover");

  const [currentParams, setCurrentParams] = useState<
    NavigationParams["params"] | null
  >(null);

  const [next, setNext] = useState<PageName | null>(null);

  const [params, setParams] = useState<NavigationParams["params"] | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [previousLeft, setPreviousLeft] = useState<HistoryItem | null>(null);

  const [animating, setAnimating] = useState<boolean>(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    const params = new URLSearchParams(window.location.search);
    const auth = params.get("auth");

    if (auth === "update") {
      setCurrent("update");
      return;
    }

    if (user) {
      setCurrent("discover"); //discover
    } else {
      setCurrent("cover"); //cover
    }
  }, [user, isLoading]);

  function navigate({ to, direction = "next", params }: NavigationParams) {
    if (animating) return;

    setHistory((prev) => [
      ...prev,
      {
        page: current,
        params: currentParams,
      },
    ]);

    setNext(to);
    setDirection(direction);
    setParams(params ?? null);
    setAnimating(true);
  }

  function goBack() {
    if (animating) return;

    const previous = history[history.length - 1];

    if (!previous) return;

    setNext(previous.page);
    setParams(previous.params);
    setPreviousLeft(history[history.length - 2] ?? null);
    setDirection("prev");
    setHistory((prev) => prev.slice(0, -1));
    setAnimating(true);
  }

  function onDone() {
    if (!next) return;

    setCurrent(next);
    setCurrentParams(params);

    setNext(null);
    setParams(null);
    setAnimating(false);
  }

  const CurrentPage = PAGES[current];
  const NextPage = next ? PAGES[next] : null;
  const PreviousLeftPage = previousLeft ? PAGES[previousLeft.page] : null;

  return (
    <div className="w-full h-full flex">
      <PageFlip
        current={
          <CurrentPage
            onNavigate={navigate}
            onBack={goBack}
            params={currentParams}
          />
        }
        next={
          NextPage ? (
            <NextPage onNavigate={navigate} onBack={goBack} params={params} />
          ) : null
        }
        previousLeft={
          PreviousLeftPage ? (
            <PreviousLeftPage
              onNavigate={navigate}
              onBack={goBack}
              params={previousLeft?.params}
            />
          ) : null
        }
        animating={animating}
        direction={direction}
        onDone={onDone}
        isCover={current === "cover"}
      />
    </div>
  );
}
