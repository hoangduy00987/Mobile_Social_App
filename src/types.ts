export type Post = {
  id: number
  title: string
  created_at: string
  vote_count: number
  nr_of_comments: number
  image: string | null
  content: string | null
  author_id: number
  subreddit_id: number | null
  media: PostMedia[]
  community: Subreddit
  author: User
}

export type PostMedia = {
  id: number
  post_id: number
  media_url: string
  media_type: 'image' | 'video'
  created_at: string
}

export type Vote = {
  vote_type: 1 | -1
  post_id: number
  comment_id: number | null
}

export type Comment = {
  id: number
  post_id: number
  author_id: number
  parent_comment_id: number | null
  content: string
  created_at: string
  vote_count: number
  author: User
  replies: Comment[]
}

export type Subreddit = {
  community_id: number
  name: string
  avatar: string | null
  type: string
  members_count: number
}

export type User = {
  id: number
  email: string
  full_name: string
  avatar: string | null
}

export type SavedPost = {
  id: number
  user_id: number
  post_id: number
  saved_at: string
}

export type Community = {
  community_id: number
  name: string
  created_by: number
  type_id: number
  avatar: string
  created_at: string
  updated_at: string
  communityType: CommunityType
  members: number
}

export type CommunityType = {
  type_id: number
  type: string
  description: string
}

export type CommunityMember = {
  id: number
  community_id: number
  user_id: number
  role: 'member' | 'admin' | 'moderator'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  joined_at: string
}

export type FactCheckResponse = {
  claim: string
  verdict: 'TRUE' | 'FALSE' | 'NEI'
  explanation: string
}
