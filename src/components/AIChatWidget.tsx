import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Modal,
} from 'react-native'
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'
import { factCheckClaim } from '../apis/AIService'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  factCheckResults?: Array<{
    claim: string
    verdict: string
    explanation: string
  }>
}

type AIChatWidgetProps = {
  initialMessages?: Message[]
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ initialMessages = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: '1',
            role: 'assistant',
            content:
              "Hello! I'm your AI fact-checking assistant. Send me a claim or statement, and I'll help verify it for you!",
            timestamp: new Date(),
          },
        ]
  )
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const scaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start()
  }, [])

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    const claim = inputValue.trim()
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const results = await factCheckClaim(claim)

      // Giả lập API call
      setTimeout(() => {
        if (results && results.length > 0) {
          let responseContent = 'Fact-Check Results:\n\n'

          results.forEach((result, index) => {
            responseContent += `Claim: ${result.claim}\n`
            responseContent += `Verdict: ${result.verdict}\n`
            responseContent += `Explanation: ${result.explanation}\n`
            if (index < results.length - 1) {
              responseContent += '\n---\n\n'
            }
          })

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseContent,
            timestamp: new Date(),
            factCheckResults: results,
          }

          setMessages((prev) => [...prev, assistantMessage])
        } else {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content:
              "I couldn't find any fact-check results for that claim. Please try rephrasing your question.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        }
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.log('Error checking fact:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while checking the fact. Please try again later.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarAssistant}>
            <FontAwesome6 name="robot" size={20} color="white" />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            { maxWidth: '75%' },
          ]}
        >
          {message.factCheckResults && message.factCheckResults.length > 0 ? (
            <View>
              <Text style={[styles.messageText, styles.boldText, { marginBottom: 8 }]}>
                Fact-Check Results:
              </Text>
              {message.factCheckResults.map((result, index) => (
                <View key={index} style={styles.factCheckResult}>
                  <View style={styles.factCheckSection}>
                    <Text style={styles.factCheckLabel}>Claim:</Text>
                    <Text style={styles.messageText}>{result.claim}</Text>
                  </View>

                  <View style={styles.factCheckSection}>
                    <Text style={styles.factCheckLabel}>Verdict:</Text>
                    <View
                      style={[
                        styles.badge,
                        result.verdict.toLowerCase().includes('true')
                          ? styles.badgeGreen
                          : result.verdict.toLowerCase().includes('false')
                          ? styles.badgeRed
                          : styles.badgeYellow,
                      ]}
                    >
                      <Text style={styles.badgeText}>{result.verdict}</Text>
                    </View>
                  </View>

                  <View style={styles.factCheckSection}>
                    <Text style={styles.factCheckLabel}>Explanation:</Text>
                    <Text style={styles.messageText}>{result.explanation}</Text>
                  </View>

                  {index < message?.factCheckResults?.length! - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.messageText, isUser && styles.userMessageText]}>
              {message.content}
            </Text>
          )}
        </View>

        {isUser && (
          <View style={styles.avatarUser}>
            <FontAwesome6 name="circle-user" size={20} color="white" />
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Floating Button */}
      <Animated.View style={[styles.floatingButton, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={styles.floatingButtonTouchable}
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.8}
        >
          {isOpen ? (
            <Ionicons name="close" size={24} color="white" />
          ) : (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.chatContainer, isMaximized && styles.chatContainerMaximized]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.sparkleIcon}>✨</Text>
                <Text style={styles.headerTitle}>AI Assistant</Text>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setIsMaximized(!isMaximized)}
                >
                  {isMaximized ? (
                    <Ionicons name="contract" size={24} color="white" />
                  ) : (
                    <FontAwesome6 name="expand" size={24} color="white" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.headerButton} onPress={() => setIsOpen(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(renderMessage)}

              {isLoading && (
                <View style={styles.messageContainer}>
                  <View style={styles.avatarAssistant}>
                    <FontAwesome6 name="robot" size={20} color="white" />
                  </View>
                  <View style={[styles.messageBubble, styles.assistantBubble]}>
                    <ActivityIndicator color="#FF3C00" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Type your message..."
                placeholderTextColor="#A0AEC0"
                editable={!isLoading}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputValue.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  floatingButtonTouchable: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3C00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chatContainer: {
    width: '95%',
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
  },
  chatContainerMaximized: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  header: {
    backgroundColor: '#FF3C00',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    flexDirection: 'row',
  },
  avatarAssistant: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#718096',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#E9D8FD',
  },
  assistantBubble: {
    backgroundColor: '#EDF2F7',
  },
  messageText: {
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#2D3748',
  },
  boldText: {
    fontWeight: 'bold',
  },
  factCheckResult: {
    marginTop: 8,
  },
  factCheckSection: {
    marginBottom: 12,
  },
  factCheckLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeGreen: {
    backgroundColor: '#C6F6D5',
  },
  badgeRed: {
    backgroundColor: '#FED7D7',
  },
  badgeYellow: {
    backgroundColor: '#FEFCBF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF3C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
})

export default AIChatWidget
