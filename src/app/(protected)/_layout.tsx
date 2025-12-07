import { Redirect, Stack, router } from 'expo-router'
import { View } from 'react-native'
import { AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons'
import { useAuth } from '../../contexts/AuthContext'

export default function AppLayout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/signIn'} />
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="communitySelector" options={{ headerShown: false }} />
      {/* <Stack.Screen
        name="post/[id]"
        options={{
          headerTitle: '',
          headerStyle: { backgroundColor: '#FF5700' },
          headerLeft: () => (
            <AntDesign name="close" size={24} color="white" onPress={() => router.back()} />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <AntDesign name="search" size={24} color="white" />
              <MaterialIcons name="sort" size={27} color="white" />
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </View>
          ),
          animation: 'slide_from_bottom',
        }}
      /> */}
      <Stack.Screen
        name="post/comment"
        options={{
          title: 'Comment',
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="user/profile" options={{ title: 'Profile' }} />
    </Stack>
  )
}
