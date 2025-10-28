import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Community {
  id: string
  name: string
  members: string
  description: string
  icon: string
  iconBg: string
}

export default function CommunitiesScreen() {
  const topicButtons = [
    'Internet Culture',
    'Games',
    'Q&As & Stories',
    'Education & U',
    'Technology',
    'Movies & TV',
    'Places & Travel',
    'Fashion & B',
    'Pop Culture',
    'Sports',
    'Business & Finance',
    'News & Polit',
  ]

  const recommendedCommunities: Community[] = [
    {
      id: '1',
      name: 'CosplayHelp',
      members: '79.3k members',
      description:
        'Get help with armor making, sewing, wig help, and more from a supportive community.',
      icon: '🎭',
      iconBg: '#F5A524',
    },
    {
      id: '2',
      name: 'LenovoLegion',
      members: '90.5k members',
      description: 'Discuss and learn all things Lenovo Legion in this helpful community.',
      icon: '⚡',
      iconBg: '#4A90E2',
    },
  ]

  const placesTravel: Community[] = [
    {
      id: '3',
      name: 'illinois',
      members: '288k members',
      description: 'From Chicago to Springfield, explore all that Illinois has to offer.',
      icon: '🏙️',
      iconBg: '#2C8CB8',
    },
    {
      id: '4',
      name: 'europe',
      members: '11.4m members',
      description:
        'Join the conversation about culture, politics, history, and life across Europe.',
      icon: '🇪🇺',
      iconBg: '#FFD700',
    },
  ]

  const fashionBeauty: Community[] = [
    {
      id: '5',
      name: 'malefashionadvice',
      members: '5.2m members',
      description: 'Making clothing less intimidating and helping you develop your own style.',
      icon: '👔',
      iconBg: '#8B4513',
    },
  ]

  const renderCommunityCard = (community: Community) => (
    <View key={community.id} style={styles.communityCard}>
      <View style={styles.communityHeader}>
        <View style={[styles.communityIcon, { backgroundColor: community.iconBg }]}>
          <Text style={styles.communityIconText}>{community.icon}</Text>
        </View>
        <View style={styles.communityInfo}>
          <Text style={styles.communityName}>{community.name}</Text>
          <Text style={styles.communityMembers}>{community.members}</Text>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.communityDescription}>{community.description}</Text>
    </View>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Topic Pills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore communities by topic</Text>
        <View style={styles.topicContainer}>
          {topicButtons.map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicPill}>
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recommended Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
        {recommendedCommunities.map(renderCommunityCard)}
      </View>

      {/* Places & Travel Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Places & Travel</Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </View>
        {placesTravel.map(renderCommunityCard)}
      </View>

      {/* Fashion & Beauty Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fashion & Beauty</Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </View>
        {fashionBeauty.map(renderCommunityCard)}
      </View>

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
    padding: 16,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  communityMembers: {
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  communityDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
})
