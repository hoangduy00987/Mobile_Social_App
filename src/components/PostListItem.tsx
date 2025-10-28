import { Image, Pressable, Text, View, StyleSheet } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { formatDistanceToNowStrict } from 'date-fns'
import { Link } from 'expo-router'
// import { Tables } from '../types/database.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUpvote, selectMyVote } from '../services/upvotesService'
import { deleteSavedPost, savePost, selectMySavedPost } from '../services/postService'
import { useAuth, useSession } from '@clerk/clerk-expo'
import SupabaseImage from './SupabaseImage'
import { Post } from '../types'

// type Post = Tables<'posts'> & {
//   // user: Tables<"users">;
//   group: Tables<'groups'>
//   upvotes: { sum: number }[]
// }

type PostListItemProps = {
  post: Post
  isDetailedPost?: boolean
}

export default function PostListItem({ post, isDetailedPost }: PostListItemProps) {
  const queryClient = useQueryClient()
  const { session } = useSession()
  const { getToken } = useAuth()

  const { mutate: upvote } = useMutation({
    mutationFn: (value: 1 | -1) => createUpvote(post.id, null, value, getToken),
    // Optimistic update
    onMutate: async (newValue) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', post.id, 'my-vote'] })

      // Snapshot the previous value
      const previousVote = queryClient.getQueryData(['posts', post.id, 'my-vote'])

      // Optimistically update to the new value
      queryClient.setQueryData(['posts', post.id, 'my-vote'], {
        value: newValue,
      })

      // Update post vote count optimistically
      queryClient.setQueryData(['posts'], (old: any) => {
        // Update logic for posts list
        return old
      })

      // Return context with the previous value
      return { previousVote }
    },
    onError: (err, newValue, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts', post.id, 'my-vote'], context?.previousVote)
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({
        queryKey: ['posts', post.id, 'my-vote'],
      })
    },
  })

  const {
    data: myVote,
    isLoading: isVoteLoading,
    error: voteError,
  } = useQuery({
    queryKey: ['posts', post.id, 'my-vote'],
    queryFn: () => selectMyVote(post.id, null, getToken),
    staleTime: 1000 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const { mutate: save } = useMutation({
    mutationFn: () => savePost(post.id, getToken),
    // Optimistic update
    onMutate: async (newValue) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', post.id, 'saved'] })

      // Snapshot the previous value
      const previousVote = queryClient.getQueryData(['posts', post.id, 'saved'])

      // Optimistically update to the new value
      queryClient.setQueryData(['posts', post.id, 'saved'], {
        value: newValue,
      })

      // Update post vote count optimistically
      queryClient.setQueryData(['posts'], (old: any) => {
        // Update logic for posts list
        return old
      })

      // Return context with the previous value
      return { previousVote }
    },
    onError: (err, newValue, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts', post.id, 'saved'], context?.previousVote)
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({
        queryKey: ['posts', post.id, 'saved'],
      })
    },
  })

  const { mutate: unsave } = useMutation({
    mutationFn: () => deleteSavedPost(post.id, getToken),
    // Optimistic update
    onMutate: async (newValue) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', post.id, 'saved'] })

      // Snapshot the previous value
      const previousVote = queryClient.getQueryData(['posts', post.id, 'saved'])

      // Optimistically update to the new value
      queryClient.setQueryData(['posts', post.id, 'saved'], {
        value: newValue,
      })

      // Update post vote count optimistically
      queryClient.setQueryData(['posts'], (old: any) => {
        // Update logic for posts list
        return old
      })

      // Return context with the previous value
      return { previousVote }
    },
    onError: (err, newValue, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts', post.id, 'saved'], context?.previousVote)
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({
        queryKey: ['posts', post.id, 'saved'],
      })
    },
  })

  const {
    data: savedPost,
    isLoading: isSavedLoading,
    error: savedError,
  } = useQuery({
    queryKey: ['posts', post.id, 'saved'],
    queryFn: () => selectMySavedPost(post.id, getToken),
    staleTime: 1000 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const isUpvoted = myVote?.vote_type === 1
  const isDownvoted = myVote?.vote_type === -1

  const shouldShowImage = isDetailedPost || post.media.some((m) => m.media_type === 'image')
  const shouldShowContent = isDetailedPost || !post.media.some((m) => m.media_type === 'image')
  const image = post.media.find((m) => m.media_type === 'image')

  const isSaved = savedPost?.post_id === post.id

  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          gap: 7,
          borderBottomColor: 'lightgrey',
          borderBottomWidth: 0.5,
          backgroundColor: 'white',
        }}
      >
        {/* HEADER */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Image
            source={{ uri: post.subreddit_id || '' }}
            style={{ width: 20, height: 20, borderRadius: 10, marginRight: 5 }}
          /> */}
          <View>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#3A3B3C' }}>
                {post.subreddit_id}
              </Text>
              <Text style={{ color: 'grey', fontSize: 13, alignSelf: 'flex-start' }}>
                {formatDistanceToNowStrict(new Date(post.created_at!))}
              </Text>
            </View>
            {isDetailedPost && (
              <Text style={{ fontSize: 13, color: '#2E5DAA' }}>{post.author_id}</Text>
            )}
          </View>
          <Pressable
            onPress={() => console.log('Pressed')}
            style={{
              marginLeft: 'auto',
              backgroundColor: '#0d469b',
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: 'white',
                paddingVertical: 2,
                paddingHorizontal: 7,
                fontWeight: 'bold',
                fontSize: 13,
              }}
            >
              Join
            </Text>
          </Pressable>
        </View>

        {/* CONTENT */}
        <Text style={{ fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5 }}>{post.title}</Text>
        {shouldShowImage && image && (
          <SupabaseImage
            path={image.media_url}
            bucket="images"
            style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 15 }}
          />
          // <Image
          //   source={{ uri: image.media_url }}
          //   style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 15 }}
          // />
        )}

        {shouldShowContent && post.content && (
          <Text numberOfLines={isDetailedPost ? undefined : 4}>{post.content}</Text>
        )}

        {/* FOOTER */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[{ flexDirection: 'row' }, styles.iconBox]}>
              <MaterialCommunityIcons
                onPress={() => !isVoteLoading && upvote(1)}
                name={isUpvoted ? 'arrow-up-bold' : 'arrow-up-bold-outline'}
                size={19}
                color={isVoteLoading ? 'grey' : isUpvoted ? 'crimson' : 'black'}
              />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 5,
                  alignSelf: 'center',
                }}
              >
                {post.vote_count}
              </Text>
              <View
                style={{
                  width: 1,
                  backgroundColor: '#D4D4D4',
                  height: 14,
                  marginHorizontal: 7,
                  alignSelf: 'center',
                }}
              />
              <MaterialCommunityIcons
                onPress={() => !isVoteLoading && upvote(-1)}
                name={isDownvoted ? 'arrow-down-bold' : 'arrow-down-bold-outline'}
                size={19}
                color={isVoteLoading ? 'grey' : isDownvoted ? 'crimson' : 'black'}
              />
            </View>
            <View style={[{ flexDirection: 'row' }, styles.iconBox]}>
              <MaterialCommunityIcons name="comment-outline" size={19} color="black" />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: 5,
                  alignSelf: 'center',
                }}
              >
                {post.nr_of_comments}
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 10 }}>
            <MaterialCommunityIcons
              name={isSaved ? 'trophy' : 'trophy-outline'}
              size={19}
              color={isSavedLoading ? 'grey' : isSaved ? 'crimson' : 'black'}
              style={styles.iconBox}
              onPress={() => !isSavedLoading && (isSaved ? unsave() : save())}
            />
            <MaterialCommunityIcons
              name="share-outline"
              size={19}
              color="black"
              style={styles.iconBox}
            />
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  iconBox: {
    borderWidth: 0.5,
    borderColor: '#D4D4D4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
})
