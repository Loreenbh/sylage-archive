export type User = {
  id: number
  username: string
  avatar_url?: string | null
  role: "user" | "admin"
}