import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Input from '@/components/Input';
import Button from '@/components/Button';

// Brand colors
const zorba = '#A59D94';
const white = '#ffffff';
const heavyMetal = '#222720';
const dawn = '#A9A39A';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Navigate to the main app
      router.replace('/(tabs)');
    }
  };

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack.Screen 
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                  <ThemedText style={styles.title}>Welcome back</ThemedText>
                  <ThemedText style={styles.subtitle}>Log in to your account</ThemedText>
                </View>
                
                {/* Form */}
                <View style={styles.form}>
                  <Input
                    label="Email"
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email}
                    style={styles.inputContainer}
                  />
                  
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    isPassword={true}
                    error={errors.password}
                    style={styles.inputContainer}
                  />
                  
                  <Link href="/(auth)/forgot-password" asChild>
                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                      <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
                    </TouchableOpacity>
                  </Link>
                  
                  <Button
                    label="Log In"
                    variant="primary"
                    size="large"
                    style={styles.button}
                    onPress={handleLogin}
                    fullWidth
                  />
                  
                  <View style={styles.signupContainer}>
                    <ThemedText style={styles.signupText}>
                      Don't have an account?{' '}
                    </ThemedText>
                    <Link href="/(auth)/signup" asChild>
                      <TouchableOpacity>
                        <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60, // Increased padding at the top
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: heavyMetal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: zorba,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: white,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: heavyMetal,
    fontWeight: '500',
  },
  button: {
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: heavyMetal,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    color: zorba,
  },
  signupLink: {
    fontSize: 16,
    color: heavyMetal,
    fontWeight: '500',
  },
});
