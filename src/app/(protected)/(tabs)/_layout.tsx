import { Link, Tabs, useNavigation } from 'expo-router'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { useAuth, useSession } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { Image, Pressable } from 'react-native'

export default function TabLayout() {
  const navigation: any = useNavigation()
  const { signOut } = useAuth()
  const { session } = useSession()

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync('__clerk_client_jwt')
    signOut()
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',

        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ paddingLeft: 12 }}
          >
            <AntDesign name="menu" size={22} color="black" />
          </Pressable>
        ),

        headerRight: () => (
          <Link href="/user/profile" asChild>
            <Pressable>
              <Image
                source={{ uri: session?.user.imageUrl }}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 15,
                  borderRadius: 15,
                }}
              />
            </Pressable>
          </Link>
        ),
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Reddit',
          headerTintColor: '#FF5700',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communities',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Feather name="bell" size={24} color={color} />,
        }}
      />

    </Tabs>
  )
}