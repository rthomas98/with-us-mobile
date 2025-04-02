import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

// Brand colors
const zorba = '#A59D94';
const white = '#ffffff';
const heavyMetal = '#222720';
const dawn = '#A9A39A';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <View style={styles.container}>
        {/* Background lines image */}
        <Image 
          source={require('@/assets/images/lines-right.png')} 
          style={styles.backgroundLines}
          resizeMode="stretch"
        />
        
        <View style={styles.contentContainer}>
          {/* W Logo at the top */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/w-logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>
            Define{'\n'}
            yourself in{'\n'}
            your unique{'\n'}
            way.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.outlineButton]} 
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={[styles.buttonText, styles.outlineButtonText]}>Shop as Guest</Text>
          </TouchableOpacity>
          
          {/* Page indicator */}
          <View style={styles.pageIndicator} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  backgroundLines: {
    position: 'absolute',
    right: 0,
    top: height * 0.25,
    width: width,
    height: height * 0.5,
    zIndex: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    position: 'relative',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: heavyMetal,
    lineHeight: 50,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    zIndex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: heavyMetal,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: heavyMetal,
  },
  outlineButtonText: {
    color: heavyMetal,
  },
  pageIndicator: {
    width: 40,
    height: 5,
    backgroundColor: heavyMetal,
    borderRadius: 3,
    marginTop: 20,
  },
});
