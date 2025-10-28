import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { insertComment } from '../../../services/commentsService'
import { useAuth } from '@clerk/clerk-expo'

export default function CommentTyping() {
  const [comment, setComment] = useState<string>('')
  const { id, title, parent_id } = useLocalSearchParams<{
    id: string
    title: string
    parent_id?: string
  }>()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: () => {
      if (!comment.trim()) {
        throw new Error('Comment not blank')
      }

      return insertComment(
        {
          post_id: parseInt(id),
          content: comment,
          parent_id: parent_id ? parseInt(parent_id) : undefined,
        },
        getToken
      )
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', { postId: id }] })
      queryClient.invalidateQueries({
        queryKey: ['comments', { parentId: parent_id }],
      })
      queryClient.invalidateQueries({ queryKey: ['posts', id] })

      goBack()
    },
    onError: (error) => {
      console.log(error)
      Alert.alert('Failed to insert comment', error.message)
    },
  })

  const goBack = () => {
    setComment('')
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <AntDesign name="close" size={24} color="black" onPress={() => goBack()} />
          <Text style={styles.text}>{parent_id ? 'Reply' : 'Add Comment'}</Text>
        </View>
        <Pressable
          onPress={() => createComment()}
          style={{ marginLeft: 'auto' }}
          disabled={isPending}
        >
          <Text style={styles.postText}>{isPending ? 'Posting...' : 'Post'}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 10, paddingVertical: 6 }}
        >
          <TextInput
            placeholder="Your comment"
            value={comment}
            onChangeText={(text) => setComment(text)}
            multiline
            scrollEnabled={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 10,
  },
  postText: {
    color: 'white',
    backgroundColor: '#115BCA',
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#b7b4b4ff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#0d469b',
    borderRadius: 15,
    marginLeft: 'auto',
    marginTop: 15,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  titleContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d7d7',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '500',
  },
})
