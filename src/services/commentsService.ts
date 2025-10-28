import { SupabaseClient } from '@supabase/supabase-js'
import { Database, TablesInsert } from '../types/database.types'
import { Comment } from '../types'

// export const fetchComments = async (
//   postId: string,
//   supabase: SupabaseClient<Database>,
// ) => {
//   const { data, error } = await supabase
//     .from("comments")
//     .select("*, replies:comments(*)")
//     .eq("post_id", postId)
//     .is("parent_id", null);

//   if (error) {
//     throw error;
//   } else {
//     return data;
//   }
// };

// export const fetchCommentReplies = async (parentId: string, supabase: SupabaseClient<Database>) => {
//   const { data, error } = await supabase
//     .from('comments')
//     .select('*, replies:comments(*)')
//     .eq('parent_id', parentId)

//   if (error) {
//     throw error
//   } else {
//     return data
//   }
// }

// export const insertComment = async (
//   newComment: TablesInsert<'comments'>,
//   supabase: SupabaseClient<Database>
// ) => {
//   const { data, error } = await supabase.from('comments').insert(newComment).select().single()

//   if (error) {
//     throw error
//   } else {
//     return data
//   }
// }

// export const deleteComment = async (id: string, supabase: SupabaseClient<Database>) => {
//   const { data, error } = await supabase.from('comments').delete().eq('id', id)

//   if (error) {
//     throw error
//   } else {
//     return data
//   }
// }

export const fetchComments = async (post_id: number): Promise<Comment[]> => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/comments/fetch?post_id=${post_id}`
    )
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}

export const fetchCommentReplies = async (comment_id: number): Promise<Comment[]> => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/comments/fetch-replies?comment_id=${comment_id}`
    )
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}

export const insertComment = async (
  { post_id, content, parent_id }: { post_id: number; content: string; parent_id?: number },
  getToken: any
) => {
  try {
    const token = await getToken()
    const body = {
      post_id,
      content,
      parent_comment_id: parent_id || null,
    }

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/comments/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}

export const deleteComment = async (comment_id: number, getToken: any) => {
  try {
    const token = await getToken()
    const body = {
      comment_id,
    }

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/comments/delete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}
