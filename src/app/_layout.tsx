import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { Drawer } from 'expo-router/drawer'
import { Slot } from 'expo-router'
import CustomDrawer from '../components/CustomDrawer'
import { AuthProvider } from '../contexts/AuthContext'
import { CommunityProvider } from '../contexts/CommunityContext'
import Toast from 'react-native-toast-message'
import { toastConfig } from '../utils/toastConfig'

const queryClient = new QueryClient()

export default function RootLayout() {
  useReactQueryDevTools(queryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CommunityProvider>
          <Drawer
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
              drawerType: 'slide',
              drawerActiveTintColor: '#FF5700',
              headerShown: false,
            }}
          >
            <Slot />
          </Drawer>
          <Toast config={toastConfig} />
        </CommunityProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
