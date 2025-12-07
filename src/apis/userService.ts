import { AuthState } from '../types/auth.types'
import { apiService } from './apiClient'
import { USER_SERVICE_URL } from './constants'

export const register = async (payload: { email: string; password: string; full_name: string }) => {
  const response = await apiService.post(`${USER_SERVICE_URL}/register`, payload)
  return response.data
}

export const login = async (payload: { email: string; password: string }) => {
  const response = await apiService.post(`${USER_SERVICE_URL}/login`, payload)
  return response.data
}

export const getUserProfile = async (): Promise<AuthState> => {
  const response = await apiService.get(`${USER_SERVICE_URL}/profile`)
  return response.data
}

export const updateUserProfile = async (payload: {
  full_name?: string
  avatar_url?: string
  gender?: boolean
}) => {
  const response = await apiService.put(`${USER_SERVICE_URL}/profile`, payload)
  return response.data
}
