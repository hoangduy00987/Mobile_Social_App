'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthState } from '../types/auth.types'
import { getUserProfile, login, register } from '../apis/userService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setUpAuthInterceptor } from '../apis/interceptor'
import apiClient from '../apis/apiClient'
import { showError } from '../utils/toastMessage'

interface AuthContextType {
  authUser: AuthState | null
  setAuthUser: (user: AuthState | null) => void
  isSignedIn: boolean
  isLoading: boolean
  signUp: (data: { email: string; password: string; full_name: string }) => Promise<void>
  signIn: (data: { email: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
  fetchUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUserState] = useState<AuthState | null>(null)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [authToken, setAuthToken] = useState<string | null>(null)

  const setAuthUser = (user: AuthState | null) => {
    setAuthUserState(user)
  }

  const signUp = async ({
    email,
    password,
    full_name,
  }: {
    email: string
    password: string
    full_name: string
  }) => {
    try {
      const resp = await register({ email, password, full_name })
      await AsyncStorage.setItem('auth_token', resp.access_token)
      setAuthToken(resp.access_token)
      setUpAuthInterceptor(apiClient, signOut)
      setIsSignedIn(true)
    } catch (error) {
      showError('Registration Failed', 'Unable to register with provided details.')
    }
  }

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const resp = await login({ email, password })
      await AsyncStorage.setItem('auth_token', resp.access_token)
      setAuthToken(resp.access_token)
      setUpAuthInterceptor(apiClient, signOut)
      setIsSignedIn(true)
    } catch (error) {
      showError('Login Failed', 'Invalid email or password.')
    }
  }

  const signOut = async () => {
    await AsyncStorage.removeItem('auth_token')
    setIsSignedIn(false)
    setAuthToken(null)
    setAuthUser(null)
  }

  const fetchUserProfile = async () => {
    if (authToken) {
      const resp = await getUserProfile()
      setAuthUser(resp)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token')
        if (token) {
          const resp = await getUserProfile()
          setAuthUser(resp)
          setAuthToken(token)
          setUpAuthInterceptor(apiClient, signOut)
          setIsSignedIn(true)
        }
      } catch (error) {
        console.log('Check auth error:', error)
        await AsyncStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isSignedIn,
        isLoading,
        signUp,
        signIn,
        signOut,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
