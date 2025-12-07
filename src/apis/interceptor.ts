import AsyncStorage from '@react-native-async-storage/async-storage'
import { AxiosInstance } from 'axios'

let isRefreshing = false
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

export const setUpAuthInterceptor = (axiosInstance: AxiosInstance, exitSession: () => void) => {
  // Axios interceptors for refreshing access token
  axiosInstance.interceptors.request.use(
    async (config) => {
      if (
        config.data instanceof FormData ||
        (config.data && config.data.constructor && config.data.constructor.name === 'FormData')
      ) {
        delete config.headers['Content-Type']
      }

      const token = await AsyncStorage.getItem('auth_token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      // console.log("error resp 401:", error.response);
      // console.log("original request:", error.config);

      // If the error is due to an expired token (usually 401 status)
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token
              return axiosInstance(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          exitSession() // Clear current session before refreshing
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
}
