export type Moodboard = {
  id: number
  user_id: number //user_id dans moodboard pour retrouver l user
  username?: string
  image_url: string
  tags: string[]
  created_at: string

  likes_count : number
  silhouettes_count: number
  liked_by_current_user: boolean
}