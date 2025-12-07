import * as React from 'react'
import {
  Text,
  TextInput,
  Button,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'

export default function SignUpScreen() {
  const router = useRouter()
  const { signUp, fetchUserProfile } = useAuth()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoading) return

    // Start sign-up process using email and password provided
    try {
      signUp({
        email: emailAddress,
        password,
        full_name: username,
      }).then(async () => {
        await fetchUserProfile()
      })
      // Send user an email with verification code

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      console.log(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoading) return

    try {
      // If verification was completed, set the session to active
      // and redirect the user
      router.replace('/')
    } catch (err) {
      console.log(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Verify Your Email</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#aaa"
          onChangeText={setCode}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#aaa"
        onChangeText={setEmailAddress}
      />
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={username}
        placeholder="Enter username"
        placeholderTextColor="#aaa"
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5700',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
})
