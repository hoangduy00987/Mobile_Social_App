import { SupabaseClient } from '@supabase/supabase-js'
import { Database, TablesInsert } from '../types/database.types'
import { Post, PostMedia, SavedPost } from '../types'
// type InsertPost = TablesInsert<'posts'>

// export const fetchPosts = async (
//   { limit = 10, offset = 0 }: { limit?: number; offset?: number },
//   supabase: SupabaseClient<Database>,
// ) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select(
//       "*, group:groups(*), upvotes(value.sum()), nr_of_comments:comments(count)",
//     )
//     .order("created_at", { ascending: false })
//     .range(offset, offset + limit - 1);

//   if (error) {
//     throw error;
//   } else {
//     return data;
//   }
// };

// export const fetchPostById = async (
//   id: string,
//   supabase: SupabaseClient<Database>,
// ) => {
//   const { data, error } = await supabase
//     .from("posts")
//     .select(
//       "*, group:groups(*), upvotes(value.sum()), nr_of_comments:comments(count)",
//     )
//     .eq("id", id)
//     .single();

//   if (error) {
//     throw error;
//   } else {
//     return data;
//   }
// };

// export const fetchPostUpvotes = async (
//   id: string,
//   supabase: SupabaseClient<Database>,
// ) => {
//   const { data, error } = await supabase
//     .from("upvotes")
//     .select("value.sum()")
//     .eq(
//       "post_id",
//       id,
//     );

//   console.log(error);

//   if (error) {
//     throw error;
//   } else {
//     return data;
//   }
// };

// export const deletePostById = async (
//   id: string,
//   supabase: SupabaseClient<Database>,
// ) => {
//   const { data, error } = await supabase.from("posts").delete().eq("id", id);
//   if (error) {
//     throw error;
//   } else {
//     return data;
//   }
// };

// export const insertPost = async (
//   post: InsertPost,
//   supabase: SupabaseClient<Database>,
// ) => {
//   // use supabase to insert a new post
//   const { data, error } = await supabase
//     .from("posts")
//     .insert(post)
//     .select()
//     .single();

//   if (error) {
//     throw error;
//   } else {
//     return data;
//   }
// };

export const fetchPosts = async ({
  limit = 10,
  offset = 0,
}: {
  limit?: number
  offset?: number
}): Promise<{ posts: Post[]; hasMore: boolean }> => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/posts?limit=${limit}&offset=${offset}`
    )
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}

export const fetchPostById = async (id: number): Promise<Post> => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}

export const deletePostById = async (id: number) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}

export const insertPost = async (
  {
    title,
    content,
    subreddit_id,
    media = [],
  }: {
    title: string
    content: string
    subreddit_id?: number
    media?: Partial<PostMedia>[]
  },
  getToken: any
) => {
  try {
    const token = await getToken()
    const body = {
      title,
      content,
      subreddit_id: subreddit_id || null,
      media,
    }

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/`, {
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

export const savePost = async (id: number, getToken: any) => {
  try {
    const token = await getToken()
    const body = {
      post_id: id,
    }

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/save`, {
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

export const deleteSavedPost = async (id: number, getToken: any) => {
  try {
    const token = await getToken()
    const body = {
      post_id: id,
    }

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/saved`, {
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

export const selectMyAllSavedPosts = async (getToken: any): Promise<SavedPost[]> => {
  try {
    const token = await getToken()

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/saved`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}

export const selectMySavedPost = async (id: number, getToken: any): Promise<SavedPost | null> => {
  try {
    const token = await getToken()

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/posts/saved/mine?post_id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error occurred', error)
    throw error
  }
}
