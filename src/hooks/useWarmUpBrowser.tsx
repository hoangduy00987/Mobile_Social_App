import { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

// Preloads the browser for Android devices to reduce authentication load time
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}
