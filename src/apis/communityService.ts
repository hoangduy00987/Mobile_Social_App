import { Community, CommunityMember, CommunityType } from '../types'
import { apiService } from './apiClient'
import { COMMUNITY_SERVICE_URL } from './constants'

export const createCommunity = async (payload: {
  name: string
  created_by: number
  type_id: number
}) => {
  const response = await apiService.post(`${COMMUNITY_SERVICE_URL}/community/`, payload)
  return response.data
}

export const getCommunities = async (): Promise<Community[]> => {
  const response = await apiService.get(`${COMMUNITY_SERVICE_URL}/community/`)
  return response.data
}

export const getMyCreatedCommunities = async (user_id: number): Promise<Community[]> => {
  const response = await apiService.get(`${COMMUNITY_SERVICE_URL}/community/by-created/`, {
    created_by: user_id,
  })
  return response.data
}

export const getMyJoinedCommunities = async (user_id: number): Promise<Community[]> => {
  const response = await apiService.get(
    `${COMMUNITY_SERVICE_URL}/community/joined-community/${user_id}`
  )
  return response.data
}

export const searchCommunities = async (q: string): Promise<Community[]> => {
  const response = await apiService.get(`${COMMUNITY_SERVICE_URL}/community/search/`, { q })
  return response.data
}

export const getCommunityById = async (id: number): Promise<any> => {
  const response = await apiService.get(`${COMMUNITY_SERVICE_URL}/community/${id}`)
  return response.data
}

export const uploadCommunityAvatar = async (community_id: number, file: any) => {
  const formData = new FormData()
  formData.append('avatar', file)
  const response = await apiService.postFormData(
    `${COMMUNITY_SERVICE_URL}/community/${community_id}/upload-avatar/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

export const updateCommunityInfo = async (
  community_id: number,
  payload: { name?: string; type_id?: number }
) => {
  const response = await apiService.put(
    `${COMMUNITY_SERVICE_URL}/community/${community_id}/`,
    payload
  )
  return response.data
}

export const deleteCommunity = async (community_id: number) => {
  const response = await apiService.delete(`${COMMUNITY_SERVICE_URL}/community/${community_id}/`)
  return response.data
}

export const joinCommunity = async ({
  community_id,
  user_id,
  role,
  status,
}: {
  community_id: number
  user_id: number
  role: string
  status: string
}) => {
  const response = await apiService.post(`${COMMUNITY_SERVICE_URL}/community-member/`, {
    community_id,
    user_id,
    role,
    status,
  })
  return response.data
}

export const getMembersById = async (community_id: number): Promise<any> => {
  const response = await apiService.get(`${COMMUNITY_SERVICE_URL}/community-member/${community_id}`)
  return response.data
}

export const getMembersPendingById = async (community_id: number): Promise<any> => {
  const response = await apiService.get(
    `${COMMUNITY_SERVICE_URL}/community-member/pending/${community_id}`
  )
  return response.data
}

export const approveMember = async (community_id: number, user_id: number) => {
  const response = await apiService.patch(
    `${COMMUNITY_SERVICE_URL}/community-member/${community_id}/approve-member/${user_id}`,
    {}
  )
  return response.data
}

export const rejectMember = async (community_id: number, user_id: number) => {
  const response = await apiService.delete(
    `${COMMUNITY_SERVICE_URL}/community-member/${community_id}/reject-member/${user_id}`
  )
  return response.data
}

export const getAllCommunityTypes = async (): Promise<CommunityType[]> => {
  const response = await apiService.get(`${COMMUNITY_SERVICE_URL}/community-type/`)
  return response.data
}
