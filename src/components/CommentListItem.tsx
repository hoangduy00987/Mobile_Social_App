import { View, Text, Image, Pressable, FlatList } from 'react-native'
import { Entypo, Octicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { formatDistanceToNowStrict } from 'date-fns'
import { useState, memo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteComment, fetchCommentReplies } from '../services/commentsService'
import { createUpvote, selectMyVote } from '../services/upvotesService'
import { useSupabase } from '../lib/supabase'
// import { Tables } from '../types/database.types'
import { useAuth, useSession } from '@clerk/clerk-expo'
import { Comment } from '../types'

// type Comment = Tables<"comments">;

type CommentListItemProps = {
  comment: Comment
  depth: number
  isReplied: boolean
  handleReplyButtonPressed: (commentId: number, content: string) => void
}

const CommentListItem = ({
  comment,
  depth,
  isReplied,
  handleReplyButtonPressed,
}: CommentListItemProps) => {
  const [isShowReplies, setIsShowReplies] = useState<boolean>(false)

  const { session } = useSession()

  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  const { data: replies } = useQuery({
    queryKey: ['comments', { parentId: comment.id }],
    queryFn: () => fetchCommentReplies(comment.id),
  })

  const { mutate: removeComment } = useMutation({
    mutationFn: () => deleteComment(comment.id, getToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', { postId: comment.post_id }],
      })
      queryClient.invalidateQueries({
        queryKey: ['comments', { parentId: comment.parent_comment_id }],
      })
    },
  })

  const { mutate: upvote } = useMutation({
    mutationFn: (value: 1 | -1) => createUpvote(comment.post_id, comment.id, value, getToken),
    // Optimistic update
    onMutate: async (newValue) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', comment.id, 'my-vote'] })

      // Snapshot the previous value
      const previousVote = queryClient.getQueryData(['comments', comment.id, 'my-vote'])

      // Optimistically update to the new value
      queryClient.setQueryData(['comments', comment.id, 'my-vote'], {
        value: newValue,
      })

      // Update comment vote count optimistically
      queryClient.setQueryData(['comments'], (old: any) => {
        // Update logic for comments list
        return old
      })

      // Return context with the previous value
      return { previousVote }
    },
    onError: (err, newValue, context) => {
      // Rollback on error
      queryClient.setQueryData(['comments', comment.id, 'my-vote'], context?.previousVote)
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({
        queryKey: ['comments', { postId: comment.post_id }],
      })
      queryClient.invalidateQueries({
        queryKey: ['comments', { parentId: comment.parent_comment_id }],
      })
    },
  })

  const {
    data: myVote,
    isLoading: isVoteLoading,
    error: voteError,
  } = useQuery({
    queryKey: ['comments', comment.id, 'my-vote'],
    queryFn: () => selectMyVote(comment.post_id, comment.id, getToken),
    staleTime: 1000 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  })

  const isUpvoted = myVote?.vote_type === 1
  const isDownvoted = myVote?.vote_type === -1

  return (
    <View
      style={{
        backgroundColor: 'white',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 10,
        borderLeftColor: '#E5E7EB',
        borderLeftWidth: depth > 0 ? 1 : 0,
      }}
    >
      {/* User Info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <Image
          source={{
            uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg',
          }}
          style={{ width: 28, height: 28, borderRadius: 15, marginRight: 4 }}
        />
        <Text style={{ fontWeight: '600', color: '#737373', fontSize: 13 }}>
          {comment.author_id}
        </Text>
        <Text style={{ color: '#737373', fontSize: 13 }}>&#x2022;</Text>
        <Text style={{ color: '#737373', fontSize: 13 }}>
          {formatDistanceToNowStrict(new Date(comment.created_at))}
        </Text>
      </View>
      {/* Comment Content */}
      <Text>{comment.content}</Text>
      {/* Comment Actions */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {session?.user.id === comment.author_id.toString() && (
          <Entypo onPress={() => removeComment()} name="trash" size={15} color="#737373" />
        )}
        <Octicons
          name="reply"
          size={16}
          color={isReplied ? 'crimson' : '#737373'}
          onPress={() => handleReplyButtonPressed(comment.id, comment.content)}
        />
        <MaterialCommunityIcons name="trophy-outline" size={16} color="#737373" />
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <MaterialCommunityIcons
            onPress={() => !isVoteLoading && upvote(1)}
            name={isUpvoted ? 'arrow-up-bold' : 'arrow-up-bold-outline'}
            size={18}
            color={isVoteLoading ? 'grey' : isUpvoted ? 'crimson' : '#737373'}
          />
          <Text style={{ fontWeight: '500', color: '#737373' }}>{comment.vote_count}</Text>
          <MaterialCommunityIcons
            onPress={() => !isVoteLoading && upvote(-1)}
            name={isDownvoted ? 'arrow-down-bold' : 'arrow-down-bold-outline'}
            size={18}
            color={isVoteLoading ? 'grey' : isDownvoted ? 'crimson' : '#737373'}
          />
        </View>
      </View>
      {/* Show Replies Button */}
      {!!replies?.length && !isShowReplies && depth < 5 && (
        <Pressable
          onPress={() => setIsShowReplies(true)}
          style={{
            backgroundColor: '#EDEDED',
            borderRadius: 2,
            paddingVertical: 3,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontWeight: '500',
              color: '#545454',
            }}
          >
            Show Replies
          </Text>
        </Pressable>
      )}
      {/* List of Replies */}
      {/* {isShowReplies && (
        <FlatList
          data={comment.replies}
          renderItem={({ item }) => (
            <CommentListItem
              comment={item}
              depth={depth + 1}
              handleReplyButtonPressed={handleReplyButtonPressed}
            />
          )}
        />
      )} */}

      {isShowReplies &&
        !!replies?.length &&
        replies.map((item) => (
          <CommentListItem
            key={item.id}
            comment={item}
            depth={depth + 1}
            isReplied={isReplied}
            handleReplyButtonPressed={handleReplyButtonPressed}
          />
        ))}
    </View>
  )
}

export default memo(CommentListItem)
