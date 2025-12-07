import { useState } from 'react'
import {
  View,
  Image,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { AntDesign, Feather } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

import { selectedCommunityAtom } from '../../../atoms'
import { useAtom } from 'jotai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { insertPost } from '../../../apis/postService'
import { PostMedia } from '../../../types'
import { isValidURL } from '../../../utils/verifyString'

export default function CreateScreen() {
  const [title, setTitle] = useState<string>('')
  const [bodyText, setBodyText] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)
  const [video, setVideo] = useState<string | null>(null)
  const [link, setLink] = useState<string>('')
  const [linkInput, setLinkInput] = useState<boolean>(false)

  const [community, setCommunity] = useAtom(selectedCommunityAtom)

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (image: string | undefined) => {
      if (!community) {
        throw new Error('Please select a community')
      }
      if (!title) {
        throw new Error('Title is required')
      }

      let media: Partial<PostMedia>[] = []
      if (image) {
        media.push({ media_type: 'image', media_url: image })
      }

      return insertPost(
        {
          title,
          content: bodyText,
          subreddit_id: community.community_id,
        },
        { media_type: '', file: null }
      )
    },
    onSuccess: (data) => {
      // invalidate queries that might have been affected by inserting a post
      queryClient.invalidateQueries({ queryKey: ['posts'] })

      goBack()
    },
    onError: (error) => {
      console.log(error)
      Alert.alert('Failed to insert post', error.message)
    },
  })

  const onPostClick = async () => {
    // let imagePath = image ? await uploadImage(image, supabase) : undefined
    let imagePath = undefined

    mutate(imagePath)
  }

  const goBack = () => {
    setTitle('')
    setBodyText('')
    setCommunity(null)
    setImage(null)
    setVideo(null)
    router.back()
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setVideo(result.assets[0].uri)
    }
  }

  const cancelInputLink = () => {
    setLink('')
    setLinkInput(false)
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingHorizontal: 10 }}>
      {/* HEADER */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AntDesign name="close" size={30} color="black" onPress={() => goBack()} />
        <Pressable
          onPress={() => onPostClick()}
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
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 15 }}>
          {/* COMMUNITY SELECTOR */}
          <Link href={'communitySelector'} asChild>
            <Pressable style={styles.communityContainer}>
              {community ? (
                <>
                  <Image
                    source={
                      community.avatar
                        ? { uri: community.avatar }
                        : require('../../../../assets/header.png')
                    }
                    style={{ width: 20, height: 20, borderRadius: 10 }}
                  />
                  <Text style={{ fontWeight: '600' }}>{community.name}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.rStyles}>r/</Text>
                  <Text style={{ fontWeight: '600' }}>Select a community</Text>
                </>
              )}
            </Pressable>
          </Link>

          {/* INPUTS */}
          <TextInput
            placeholder="Title"
            style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 20 }}
            value={title}
            onChangeText={(text) => setTitle(text)}
            multiline
            scrollEnabled={false}
          />

          {image && (
            <View style={{ paddingBottom: 20 }}>
              <AntDesign
                name="close"
                size={25}
                color="white"
                onPress={() => setImage(null)}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 10,
                  top: 10,
                  padding: 5,
                  backgroundColor: '#00000090',
                  borderRadius: 20,
                }}
              />
              <Image source={{ uri: image }} style={{ width: '100%', aspectRatio: 1 }} />
            </View>
          )}

          {linkInput && (
            <View style={styles.linkInput}>
              <AntDesign
                name="close"
                size={20}
                color="black"
                onPress={cancelInputLink}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 10,
                  top: 10,
                }}
              />
              <TextInput
                placeholder="Enter the link"
                value={link}
                onChangeText={(text) => setLink(text)}
              />
            </View>
          )}

          {link &&
            (isValidURL(link) ? (
              <WebView style={styles.webView} source={{ uri: link }} />
            ) : (
              <View style={styles.errorView}>
                <Text>Invalid link</Text>
              </View>
            ))}

          <TextInput
            placeholder="body text (optional)"
            value={bodyText}
            onChangeText={(text) => setBodyText(text)}
            multiline
            scrollEnabled={false}
          />
        </ScrollView>

        {/* FOOTER */}
        <View style={{ flexDirection: 'row', gap: 20, padding: 10 }}>
          <Feather name="link" size={20} color="black" onPress={() => setLinkInput(true)} />
          <Feather name="image" size={20} color="black" onPress={pickImage} />
          <Feather name="youtube" size={20} color="black" onPress={pickVideo} />
          <Feather name="list" size={20} color="black" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  postText: {
    color: 'white',
    backgroundColor: '#115BCA',
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
  },
  rStyles: {
    backgroundColor: 'black',
    color: 'white',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  communityContainer: {
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    gap: 5,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  linkInput: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'grey',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  webView: {
    width: '100%',
    height: 250,
  },
  errorView: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(244, 188, 188, 0.9)',
  },
})
