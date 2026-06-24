import type { PageName } from "./pages"

export type Direction = "next" | "prev"

export type NavigationParams = {
  to: PageName
  direction?: Direction
  params?: Record<string, unknown>
}

export type OnNavigate = (params: NavigationParams) => void