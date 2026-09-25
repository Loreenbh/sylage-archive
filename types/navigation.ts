import type { PageName } from "./pages";

export type Direction = "next" | "prev";

export type NavigationPayload = {
  userId?: number;
  moodboardId?: number;

  from?: PageName;

  isOwner?: boolean;
  fromTab?: "latest" | "curated" | "following";
  layout?: "A" | "B" | "C" | "D";
};

export type NavigationParams = {
  to: PageName;
  direction?: Direction;
  params?: NavigationPayload;
};
export type OnNavigate = (params: NavigationParams) => void;
