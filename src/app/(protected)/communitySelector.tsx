import { View, Text, TextInput, FlatList, Pressable, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign'
import { router } from 'expo-router'
import { useState } from 'react'
// import groups from "../../../assets/data/groups.json";
import { selectedCommunityAtom } from '../../atoms'
import { useSetAtom } from 'jotai'
// import { Group } from "../../types";
import { useQuery } from '@tanstack/react-query'
import { searchCommunities } from '../../apis/communityService'
import { Community } from '../../types'

export default function CommunitySelector() {
  const [searchValue, setSearchValue] = useState<string>('')
  const setCommunity = useSetAtom(selectedCommunityAtom)

  const { data, isLoading, error } = useQuery({
    queryKey: ['communities', { searchValue }],
    queryFn: () => searchCommunities(searchValue),
    staleTime: 10_000,
    placeholderData: (previousData) => previousData,
  })

  const onCommunitySelected = (community: Community) => {
    setCommunity(community)
    router.back()
  }

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error || !data) {
    return <Text>Error fetching communities</Text>
  }

  return (
    <SafeAreaView style={{ marginHorizontal: 10, flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AntDesign name="close" size={30} color="black" onPress={() => router.back()} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            flex: 1,
            paddingRight: 30,
          }}
        >
          Post to
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'lightgrey',
          borderRadius: 5,
          gap: 5,
          marginVertical: 10,
          alignItems: 'center',
          paddingHorizontal: 5,
        }}
      >
        <AntDesign name="search" size={16} color="gray" />
        <TextInput
          placeholder="Search for a community"
          placeholderTextColor={'grey'}
          style={{ paddingVertical: 10, flex: 1 }}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
        {searchValue && (
          <AntDesign
            name="close-circle"
            size={15}
            color="#E4E4E4"
            onPress={() => setSearchValue('')}
          />
        )}
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onCommunitySelected(item)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginBottom: 20,
            }}
          >
            <Image
              source={item.avatar ? { uri: item.avatar } : require('../../../assets/header.png')}
              style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
            />
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}
