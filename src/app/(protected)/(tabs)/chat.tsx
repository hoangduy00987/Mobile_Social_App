import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AIChatWidget from '../../../components/AIChatWidget'

type TabType = 'Messages' | 'Unread' | 'Requests' | 'Threads'

export default function ChatScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Messages')

  const tabs: TabType[] = ['Messages', 'Unread', 'Requests', 'Threads']

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationCircle}>
          <Text style={styles.illustrationEmoji}>💬</Text>
          <Text style={styles.illustrationSubEmoji}>👋</Text>
        </View>
      </View>
      <Text style={styles.emptyTitle}>Welcome to chat!</Text>
      <Text style={styles.emptySubtitle}>Start a conversation with someone new</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {renderEmptyState()}
      </ScrollView>

      {/* Floating Action Button */}
      {/* <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity> */}

      <AIChatWidget />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C7C7C',
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
    borderRadius: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    width: 280,
    height: 280,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  illustrationCircle: {},
  illustrationEmoji: {},
  illustrationSubEmoji: {},
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  emptySubtitle: {},
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0079D3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})
