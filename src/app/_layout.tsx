import { tokenCache } from '../../cache'
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { Drawer } from 'expo-router/drawer'
import { Slot } from 'expo-router'
import CustomDrawer from '../components/CustomDrawer'
import { AuthProvider } from '../contexts/AuthContext'
import { CommunityProvider } from '../contexts/CommunityContext'

const queryClient = new QueryClient()

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  useReactQueryDevTools(queryClient)

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env')
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <AuthProvider>
            <CommunityProvider>
              <Drawer
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{
                  drawerType: 'slide',
                  drawerActiveTintColor: '#FF5700',
                  headerShown: false
                }}
              >
                <Slot />
              </Drawer>              
            </CommunityProvider>
          </AuthProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  )
}