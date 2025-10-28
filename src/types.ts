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
  // subreddit: Subreddit;
  // user: User;
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
  // user: User
  replies: Comment[]
}

export type Subreddit = {
  id: number
  name: string
  image: string
}

export type User = {
  id: number
  name: string
  image: string | null
}

export type SavedPost = {
  id: number
  user_id: number
  post_id: number
  saved_at: string
}
