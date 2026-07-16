export type Moodboard = {
  id: number
  user_id: number
  image_url: string
  tags: string[]
  created_at: string
  likes_count : number
  silhouettes_count: number
  liked_by_current_user: boolean
}

export type MoodboardSlot = {
    url: string
    scale: number
    offsetX: number
    offsetY: number
} | null

export type MoodboardSlotPatch = Partial<{
    scale: number
    offsetX: number
    offsetY: number
}>