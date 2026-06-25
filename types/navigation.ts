import type { PageName } from "./pages"

export type Direction = "next" | "prev"

export type NavigationPayload = {
  user?: string
  moodId?: number
  from?: PageName
  isOwner?: boolean
  fromTab?: "new" | "featured" | "following"
}

export type NavigationParams = {
  to: PageName
  direction?: Direction
  params?: NavigationPayload
}
export type OnNavigate = (params: NavigationParams) => void