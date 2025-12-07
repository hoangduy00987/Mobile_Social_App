import { Stack, Redirect } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'
import { ActivityIndicator, View } from 'react-native'

export default function AuthLayout() {
  const { isSignedIn, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return (
    <Stack>
      <Stack.Screen name="signIn" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signUp" options={{ title: 'Sign Up' }} />
    </Stack>
  )
}
