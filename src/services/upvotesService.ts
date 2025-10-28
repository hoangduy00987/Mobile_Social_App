import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { Vote } from '../types'

// export const createUpvote = async (
//   post_id: string,
//   value: 1 | -1,
//   supabase: SupabaseClient<Database>,
// ) => {
//   const { data, error } = await supabase.from("upvotes").upsert({
//     post_id,
//     value,
//   }).select().single();

//   if (error) {
//     throw error;
//   } else {
//     return data;
//   }
// };

// export const selectMyVote = async (
//   post_id: string,
//   user_id: string,
//   supabase: SupabaseClient<Database>
// ) => {
//   const { data, error } = await supabase
//     .from('upvotes')
//     .select('*')
//     .eq('post_id', post_id)
//     .eq('user_id', user_id)
//     .single()

//   if (error) {
//     throw error
//   } else {
//     return data
//   }
// }

export const createUpvote = async (
  post_id: number,
  comment_id: number | null,
  vote_type: 1 | -1,
  getToken: any
) => {
  try {
    const token = await getToken()
    const body = {
      post_id,
      comment_id: comment_id || null,
      vote_type,
    }

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/votes/upsert`, {
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

export const selectMyVote = async (
  post_id: number,
  comment_id: number | null,
  getToken: any
): Promise<Vote | null> => {
  try {
    const token = await getToken()
    let url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/votes/my-vote?post_id=${post_id}`

    if (comment_id) {
      url = url + `&comment_id=${comment_id}`
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}
