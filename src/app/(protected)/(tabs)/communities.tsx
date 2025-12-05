import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'expo-router';

interface Community {
  community_id: number
  name: string
  members: string
  avatar: string
  created_by: number
  type_id: number
  created_at: string
  updated_at: string
  type: string
  status: string
}

const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CommunitiesScreen() {
  const [community, setCommunity] = useState<Community[]>([]);
  const [searchCommunity, setSearchCommunity] = useState('');
  const { authUser } = useAuth();
  const router = useRouter();

  const fetchDataCommunity = async () => {
    if (!authUser?.user_id) return;

    try {
      const [allResponse, joinedResponse] = await Promise.all([
        axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community`),
        axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community/joined-community/${authUser.user_id}`)
      ]);

      const joinedList = joinedResponse.data.map((item: any) => ({
        community_id: item.community_id,
        status: item.status ?? "APPROVED"
      }));

      const formattedData: Community[] = allResponse.data.map((item: any) => {
        const joined = joinedList.find((j: any) => j.community_id === item.community_id);

        return {
          community_id: item.community_id,
          name: item.name,
          members: item._count.members ?? "0",
          avatar: item.avatar ?? "",
          created_by: item.created_by,
          type_id: item.type_id,
          created_at: new Date(item.created_at).toISOString(),
          updated_at: new Date(item.updated_at).toISOString(),
          type: item.communityType.type,
          status: joined ? joined.status : ''
        };
      });

      // console.log(">>> Check: ", formattedData);

      setCommunity(formattedData);

    } catch (error) {
      console.error(">>> Error fetch communities: ", error);
    }
  };

  const searchData = async () => {
    try {
      await sleep(500);

      if (!searchCommunity.trim()) {
        fetchDataCommunity();
        return;
      }

      if (!authUser?.user_id) return;

      const [searchResponse, joinedResponse] = await Promise.all([
        axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community/search?q=${searchCommunity}`),
        axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community/joined-community/${authUser.user_id}`)
      ]);

      const joinedList = joinedResponse.data.map((item: any) => ({
        community_id: item.community_id,
        status: item.status ?? "APPROVED"
      }));

      const formattedData: Community[] = searchResponse.data.map((item: any) => {
        const joined = joinedList.find((j: any) => j.community_id === item.community_id);

        return {
          community_id: item.community_id,
          name: item.name,
          members: item.members ?? "0",
          avatar: item.avatar ?? "",
          created_by: item.created_by,
          type_id: item.type_id,
          created_at: item.created_at ?? '',
          updated_at: item.updated_at ?? '',
          type: item.type,
          status: joined ? joined.status : ""
        };
      });

      setCommunity(formattedData);

    } catch (error) {
      console.log(">>> Search Error:", error);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const controller = new AbortController();

    const runSearch = async () => {
      await sleep(500);
      if (!isCancelled) {
        await searchData();
      }
    };

    runSearch();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [searchCommunity]);

  useEffect(() => {
    fetchDataCommunity();
  }, []);

  const handleJoinCommunity = async (community_id: number, type: string) => {
    const status = type === 'Private' ? 'PENDING' : 'APPROVED';
    
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/community-member`, {
        community_id,
        user_id: authUser?.user_id,
        role: 'member',
        status,
      });

      fetchDataCommunity();
    } catch (error: any) {
      console.log(">>> Error:", error);
    }
  };

  const renderCommunityCard = (community: Community) => (
    <TouchableOpacity
      key={community.community_id}
      style={styles.communityCard}
      onPress={() => {
        if (community.type === 'Private' && (community.status === 'PENDING' || community.status === '')) return;
        router.push({
          pathname: '/(community)/community',
          params: { 
            name: community.name,
            community_id: community.community_id,
            created_by: community.created_by
          }
        })
      }}
    >
      <View style={styles.communityHeader}>
        <View style={[styles.communityIcon]}>
        <Image
          source={
            community.avatar && community.avatar !== ""
              ? { uri: community.avatar }
              : require('../../../../assets/header.png')
          }
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
        </View>
        <View style={styles.communityInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.communityName}>r/{community.name}</Text>
            {community.type === 'Private' && (
              <AntDesign name="lock" size={14} color="black" style={{ transform: [{ translateY: -2 }] }} />                 
            )} 
          </View>

          <Text style={styles.communityMembers}>{community.members} members</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.joinButton,
            community.status === "APPROVED" && styles.approvedButton,
            community.status === "PENDING" && styles.pendingButton,
          ]}
          disabled={community.status === "APPROVED" || community.status === "PENDING"}
          onPress={() => handleJoinCommunity(community.community_id, community.type)}
        >
          <Text
            style={[
              styles.joinButtonText,
              community.status === "APPROVED" && styles.approvedText,
              community.status === "PENDING" && styles.pendingText,
            ]}
          >
            {community.status === "PENDING"
              ? "Pending"
              : community.status === "APPROVED"
              ? "Joined"
              : "Join"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.communityDescription}>{community.description}</Text> */}
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Topic Pills Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore communities by topic</Text>
        <View style={styles.topicContainer}>
          {topicButtons.map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicPill}>
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View> */}

      {/* Recommended Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search for Community</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 30,
            borderColor: '#CCC'
          }}
        >
          <Text style={{ fontSize: 16, color: "#000" }}>r/</Text>
          <TextInput
            style={{ flex: 1, fontSize: 16, paddingVertical: 10 }}
            value={searchCommunity}
            onChangeText={(text) => setSearchCommunity(text)}
            placeholder="community-name"
            autoCapitalize="none"
          />
        </View>
        <Text style={styles.sectionTitle}>{searchCommunity ? `Result search for ${searchCommunity}` : 'Recommended for you'}</Text>
        {community.map(renderCommunityCard)}
      </View>

      {/* Places & Travel Section */}
      {/* <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Places & Travel</Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </View>
        {placesTravel.map(renderCommunityCard)}
      </View> */}

      {/* Fashion & Beauty Section */}
      {/* <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fashion & Beauty</Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </View>
        {fashionBeauty.map(renderCommunityCard)}
      </View> */}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicPill: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  topicText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  communityCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityIconText: {
    fontSize: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  communityMembers: {
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: "#579eebff",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },

  approvedButton: {
    borderWidth: 2,
    backgroundColor: '#E8E8E8',
    borderColor: '#c5c4c4ff',
  },

  pendingButton: {
    borderWidth: 2,
    backgroundColor: '#E8E8E8',
    borderColor: '#c5c4c4ff',
  },

  joinButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },

  approvedText: {
    color: "#a19898ff",
  },

  pendingText: {
    color: "#a19898ff",
  },
  communityDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 30,
  },
})
