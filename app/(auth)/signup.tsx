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

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
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
                  <ThemedText style={styles.title}>Create an account</ThemedText>
                  <ThemedText style={styles.subtitle}>Let's create your account.</ThemedText>
                </View>
                
                {/* Form */}
                <View style={styles.form}>
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    error={errors.fullName}
                    style={styles.inputContainer}
                  />
                  
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
                  
                  <ThemedText style={styles.termsText}>
                    By signing up you agree to our{' '}
                    <ThemedText style={styles.link}>Terms</ThemedText>
                    ,{' '}
                    <ThemedText style={styles.link}>Privacy Policy</ThemedText>
                    , and{' '}
                    <ThemedText style={styles.link}>Cookie Use</ThemedText>
                  </ThemedText>
                  
                  <Button
                    label="Create an Account"
                    variant="primary"
                    size="large"
                    style={styles.button}
                    onPress={handleSignup}
                    fullWidth
                  />
                  
                  <View style={styles.loginContainer}>
                    <ThemedText style={styles.loginText}>
                      Already have an account?{' '}
                    </ThemedText>
                    <Link href="/(auth)/login" asChild>
                      <TouchableOpacity>
                        <ThemedText style={styles.loginLink}>Log In</ThemedText>
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
    paddingTop: 60, 
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
  termsText: {
    fontSize: 14,
    color: zorba,
    marginBottom: 24,
    lineHeight: 20,
  },
  link: {
    color: heavyMetal,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  button: {
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: heavyMetal,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: zorba,
  },
  loginLink: {
    fontSize: 16,
    color: heavyMetal,
    fontWeight: '500',
  },
});
