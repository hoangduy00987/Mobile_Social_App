import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useSession } from '@clerk/clerk-expo'

type TabType = 'Posts' | 'Comments' | 'About'

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('Posts')
  const { session } = useSession()

  const tabs: TabType[] = ['Posts', 'Comments', 'About']

  const achievements = [
    { id: '1', emoji: '🏆', color: '#FFD700' },
    { id: '2', emoji: '⭐', color: '#FF6B6B' },
    { id: '3', emoji: '🎖️', color: '#4ECDC4' },
  ]

  const renderEmptyPosts = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration}>
        <View style={styles.snooContainer}>
          <Text style={styles.snooEmoji}>👻</Text>
        </View>
      </View>
      <Text style={styles.emptyTitle}>You don't have any posts yet</Text>
      <Text style={styles.emptyDescription}>
        Once you post to a community, it'll show up here. If you'd rather hide your posts, update
        your settings.
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          {/* Cover/Background */}
          <View style={styles.coverImage} />

          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>🤖</Text>
                </View>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.displayName}>{session?.user.fullName}</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.usernameRow}>
                <Text style={styles.username}>{`u/${session?.user.emailAddresses[0]}`}</Text>
                <Text style={styles.dot}>•</Text>
                <TouchableOpacity style={styles.followersButton}>
                  <Text style={styles.followersText}>0 followers</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialLink}>
                  <Text style={styles.socialLinkText}>Add social link</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.achievementsButton}>
                  <View style={styles.achievementBadges}>
                    {achievements.map((achievement) => (
                      <View
                        key={achievement.id}
                        style={[styles.achievementBadge, { backgroundColor: achievement.color }]}
                      >
                        <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.achievementsText}>5 achievements</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Karma</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <View style={styles.statLabelRow}>
                <Text style={styles.statLabel}>Contributions</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>9d</Text>
              <Text style={styles.statLabel}>Account Age</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Active In</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Filter/Sort Section */}
        <View style={styles.filterSection}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.filterText}>NEW POSTS</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Visibility Info */}
        <View style={styles.visibilitySection}>
          <Ionicons name="eye-outline" size={24} color="#666" />
          <Text style={styles.visibilityText}>Showing all posts</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>

        {/* Empty State */}
        {renderEmptyPosts()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1A5A96',
  },
  coverImage: {
    height: 100,
    backgroundColor: '#2E5C8A',
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarContainer: {
    marginTop: -40,
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    padding: 4,
  },
  avatarCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    backgroundColor: '#FFB5C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  profileInfo: {
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  dot: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  followersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  followersText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  socialRow: {
    gap: 8,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  socialLinkText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  achievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  achievementBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  achievementBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementEmoji: {
    fontSize: 16,
  },
  achievementsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1A5A96',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#000000',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#000000',
  },
  filterSection: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    flex: 1,
    letterSpacing: 0.5,
  },
  visibilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  visibilityText: {
    fontSize: 15,
    color: '#1C1C1C',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIllustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snooContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E8F5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  snooEmoji: {
    fontSize: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 20,
  },
})
