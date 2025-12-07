import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 20000,
})

export const apiService = {
  get: (
    url: string,
    params: object = {},
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => apiClient.get(url, { ...config, params }),
  post: (url: string, data: object, config: AxiosRequestConfig = {}): Promise<AxiosResponse> =>
    apiClient.post(url, data, config),
  postFormData: (
    url: string,
    formData: FormData,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse> => {
    const formDataConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
      },
      timeout: 20000, // Increase timeout for file uploads
    }
    return apiClient.post(url, formData, formDataConfig)
  },
  put: (url: string, data: object, config: AxiosRequestConfig = {}): Promise<AxiosResponse> =>
    apiClient.put(url, data, config),
  patch: (url: string, data: object, config: AxiosRequestConfig = {}): Promise<AxiosResponse> =>
    apiClient.patch(url, data, config),
  delete: (url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse> =>
    apiClient.delete(url, { ...config, data }),
}

export default apiClient
