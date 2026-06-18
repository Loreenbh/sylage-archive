import type { PageName } from "./pages"

export type Direction = "next" | "prev"

export type NavigationParams = {
  to: PageName              // ← PageName au lieu de string!
  direction?: Direction
}

export type OnNavigate = (params: NavigationParams) => void