import { FactCheckResponse } from '../types'
import { apiService } from './apiClient'
import { AI_SERVICE_URL } from './constants'

export const factCheckClaim = async (claim: string): Promise<FactCheckResponse[]> => {
  const response = await apiService.post(
    `${AI_SERVICE_URL}/fact-check`,
    { claim },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  return response.data
}
