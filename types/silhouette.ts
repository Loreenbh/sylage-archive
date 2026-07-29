export type Silhouette = {
  id: number
  user_id: number
  username: string

  moodboard_id: number
  target_username: string 
  target_user_id: number
  
  image_url: string
  tags: string[]
  created_at: string
  likes_count: number
  liked_by_current_user: boolean
}