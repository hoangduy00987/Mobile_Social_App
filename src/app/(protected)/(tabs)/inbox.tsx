import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'

interface Notification {
  id: string
  type: 'post' | 'system'
  icon?: string
  iconBg?: string
  title: string
  description: string
  time: string
  thumbnail?: string
  isRead?: boolean
}

export default function InboxScreen() {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'post',
      title: 'ios:',
      description: 'Is It Still Possible To Revert Back To IOS 18',
      time: '5h',
      thumbnail: '🖥️',
      isRead: false,
    },
    {
      id: '2',
      type: 'system',
      icon: '🔥',
      iconBg: '#000000',
      title: 'A new beginning',
      description: 'Congrats on your new streak! Click to learn more',
      time: '1d',
      isRead: true,
    },
    {
      id: '3',
      type: 'system',
      icon: '🏆',
      iconBg: '#000000',
      title: 'Achievement unlocked!',
      description: 'Check out your newest achievement',
      time: '3d',
      isRead: true,
    },
  ]

  const renderNotificationItem = (notification: Notification) => {
    if (notification.type === 'post') {
      return (
        <TouchableOpacity
          key={notification.id}
          style={[styles.notificationItem, !notification.isRead && styles.notificationUnread]}
        >
          <View style={styles.postNotification}>
            <View style={styles.postContent}>
              <Text style={styles.postCommunity}>{notification.title}</Text>
              <Text style={styles.postTitle}>{notification.description}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {notification.thumbnail && (
              <View style={styles.postThumbnail}>
                <Text style={styles.postThumbnailEmoji}>{notification.thumbnail}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        key={notification.id}
        style={[styles.notificationItem, notification.isRead && styles.notificationRead]}
      >
        <View style={styles.systemNotification}>
          <View style={[styles.systemIcon, { backgroundColor: notification.iconBg || '#000' }]}>
            <Text style={styles.systemIconText}>{notification.icon}</Text>
          </View>
          <View style={styles.systemContent}>
            <Text style={styles.systemTitle}>{notification.title}</Text>
            <Text style={styles.systemDescription}>{notification.description}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {notifications.map(renderNotificationItem)}
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
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationUnread: {
    backgroundColor: '#FFFFFF',
  },
  notificationRead: {
    backgroundColor: '#F5F5F5',
  },
  postNotification: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  postContent: {
    flex: 1,
    marginRight: 12,
  },
  postCommunity: {
    fontSize: 13,
    color: '#FF4500',
    fontWeight: '600',
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 15,
    color: '#1C1C1C',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  postThumbnail: {
    width: 64,
    height: 64,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postThumbnailEmoji: {
    fontSize: 32,
  },
  systemNotification: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  systemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  systemIconText: {
    fontSize: 20,
  },
  systemContent: {
    flex: 1,
  },
  systemTitle: {
    fontSize: 16,
    color: '#1C1C1C',
    fontWeight: '700',
    marginBottom: 4,
  },
  systemDescription: {
    fontSize: 14,
    color: '#7C7C7C',
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 13,
    color: '#7C7C7C',
  },
})
