import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image
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

export default function ResetPasswordScreen() {
  const colorScheme = useColorScheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Navigate to login screen after successful password reset
      router.replace('/(auth)/login');
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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
                {/* Logo */}
                <View style={styles.logoContainer}>
                  <Image 
                    source={require('@/assets/images/w-logo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                
                {/* Header */}
                <View style={styles.header}>
                  <ThemedText style={styles.title}>Reset Password</ThemedText>
                  <ThemedText style={styles.subtitle}>Create a new password for your account</ThemedText>
                </View>
                
                {/* Form */}
                <View style={styles.form}>
                  <Input
                    label="New Password"
                    placeholder="Enter your new password"
                    value={password}
                    onChangeText={setPassword}
                    isPassword={true}
                    error={errors.password}
                    style={styles.inputContainer}
                  />
                  
                  <Input
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    isPassword={true}
                    error={errors.confirmPassword}
                    style={styles.inputContainer}
                  />
                  
                  <Button 
                    label="Update Password" 
                    variant="primary"
                    size="large"
                    onPress={handleSubmit}
                    style={styles.button}
                    fullWidth
                  />
                  
                  <View style={styles.loginContainer}>
                    <ThemedText style={styles.loginText}>Remember your password? </ThemedText>
                    <Link href="/(auth)/login" asChild>
                      <TouchableOpacity>
                        <ThemedText style={styles.loginLink}>Login</ThemedText>
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
    paddingTop: 80,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  header: {
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: heavyMetal,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: zorba,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: white,
  },
  button: {
    marginTop: 24,
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
    fontWeight: 'bold',
  },
});
