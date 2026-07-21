import type { PageName } from "./pages"
import type { Moodboard } from "./moodboard"

export type Direction = "next" | "prev"

export type NavigationPayload = {
  userId?: number
  moodboardId?: number
  
  from?: PageName
  isOwner?: boolean
  fromTab?: "new" | "featured" | "following"
  layout?: "A" | "B" | "C" | "D" 
}

export type NavigationParams = {
  to: PageName
  direction?: Direction
  params?: NavigationPayload
}
export type OnNavigate = (params: NavigationParams) => void