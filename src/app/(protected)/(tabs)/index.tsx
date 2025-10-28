import { FlatList, ActivityIndicator, Text, Button } from 'react-native'
import PostListItem from '../../../components/PostListItem'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPosts } from '../../../services/postService'

export default function HomeScreen() {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: { limit: 10, offset: 0 },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined
      }
      return {
        limit: 10,
        offset: allPages.flatMap((page) => page.posts).length,
      }
    },
  })

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    console.log(error)
    return <Text>Error fetching posts</Text>
  }

  return (
    <FlatList
      data={data?.pages.flatMap((page) => page.posts) || []}
      renderItem={({ item }) => <PostListItem post={item} />}
      onRefresh={refetch}
      refreshing={isRefetching}
      onEndReachedThreshold={0.5}
      onEndReached={() => !isFetchingNextPage && hasNextPage && fetchNextPage()}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
    />
  )
}
