import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { useOAuth, useSSO } from '@clerk/clerk-expo'
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser'

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function GoogleSignIn() {
  useWarmUpBrowser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // const { startSSOFlow } = useSSO()
  const { startOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
    redirectUrl: Linking.createURL('/'),
  })
  const router = useRouter()

  const onGoogleSignInPress = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      // const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
      //   strategy: 'oauth_google',
      //   redirectUrl: Linking.createURL('/'),
      // })
      const { createdSessionId, setActive, signIn, signUp } = await startOAuthFlow()

      console.log(createdSessionId)

      if (createdSessionId) {
        // setActive!({
        //   session: createdSessionId,
        //   navigate: async ({ session }) => {
        //     const currentTask = session.currentTask
        //     if (currentTask) {
        //       console.log(currentTask)
        //       router.replace('/signIn/tasks')
        //       return
        //     }
        //   },
        // })
        setActive!({ session: createdSessionId })
        router.replace('/')
      } else {
        setError('Google sign in incomplete. Please try again!')
      }
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={onGoogleSignInPress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#007bff" />
        ) : (
          <>
            <Image source={{ uri: 'https://www.google.com/favicon.ico' }} style={styles.icon} />
            <Text style={styles.text}>Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
