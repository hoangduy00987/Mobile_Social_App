import { Comment, Post, SavedPost, Vote } from '../types'
import { apiService } from './apiClient'
import { POST_SERVICE_URL } from './constants'

export const fetchPosts = async ({
  limit = 10,
  offset = 0,
}: {
  limit?: number
  offset?: number
}): Promise<{ posts: Post[]; hasMore: boolean }> => {
  const response = await apiService.get(`${POST_SERVICE_URL}/posts`, { limit, offset })
  return response.data
}

export const fetchPostById = async (id: number): Promise<Post> => {
  const response = await apiService.get(`${POST_SERVICE_URL}/posts/${id}`)
  return response.data
}

export const deletePostById = async (id: number) => {
  const response = await apiService.delete(`${POST_SERVICE_URL}/posts/${id}`)
  return response.data
}

export const insertPost = async (
  post: { title: string; content: string; subreddit_id: number },
  media: { media_type: string; file: any }
) => {
  const formData = new FormData()
  formData.append('title', post.title)
  formData.append('content', post.content)
  formData.append('subreddit_id', post.subreddit_id.toString())
  formData.append('media_type', media.media_type)
  formData.append('file', media.file)

  const response = await apiService.postFormData(`${POST_SERVICE_URL}/posts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updatePostById = async (
  id: number,
  post: { title?: string; content?: string; subreddit_id?: number }
) => {
  const response = await apiService.put(`${POST_SERVICE_URL}/posts/${id}`, post)
  return response.data
}

export const savePost = async (post_id: number) => {
  const response = await apiService.post(`${POST_SERVICE_URL}/posts/save`, { post_id })
  return response.data
}

export const deleteSavedPost = async (post_id: number) => {
  const response = await apiService.delete(`${POST_SERVICE_URL}/posts/saved`, { post_id })
  return response.data
}

export const selectMyAllSavedPosts = async (): Promise<SavedPost[]> => {
  const response = await apiService.get(`${POST_SERVICE_URL}/posts/saved`)
  return response.data
}

export const selectMySavedPost = async (post_id: number): Promise<SavedPost> => {
  const response = await apiService.get(`${POST_SERVICE_URL}/posts/saved/mine`, { post_id })
  return response.data
}

export const fetchComments = async (post_id: number): Promise<Comment[]> => {
  const response = await apiService.get(`${POST_SERVICE_URL}/comments/fetch`, { post_id })
  return response.data
}

export const fetchCommentReplies = async (comment_id: number): Promise<Comment[]> => {
  const response = await apiService.get(`${POST_SERVICE_URL}/comments/fetch-replies`, {
    comment_id,
  })
  return response.data
}

export const insertComment = async (comment: {
  post_id: number
  content: string
  parent_comment_id?: number
}) => {
  const response = await apiService.post(`${POST_SERVICE_URL}/comments/create`, comment)
  return response.data
}

export const deleteComment = async (comment_id: number) => {
  const response = await apiService.delete(`${POST_SERVICE_URL}/comments/delete`, { comment_id })
  return response.data
}

export const createUpvote = async (vote: {
  post_id: number
  comment_id?: number
  vote_type: 1 | -1
}) => {
  const response = await apiService.post(`${POST_SERVICE_URL}/votes/upsert`, vote)
  return response.data
}

export const selectMyVote = async (post_id: number, comment_id?: number): Promise<Vote> => {
  const params: any = { post_id }
  if (comment_id) {
    params.comment_id = comment_id
  }
  const response = await apiService.get(`${POST_SERVICE_URL}/votes/my-vote`, params)
  return response.data
}
