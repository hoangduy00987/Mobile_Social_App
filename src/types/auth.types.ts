export interface AuthState {
  id: number
  email: string
  profile: {
    id?: number
    user_id?: number
    full_name?: string
    avatar: string
    gender?: boolean
  }
}
