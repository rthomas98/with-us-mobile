import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, useColorScheme, Image } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemedText } from '../ThemedText';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Brand colors
const zorba = '#A59D94';
const white = '#ffffff';
const heavyMetal = '#222720';
const dawn = '#A9A39A';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* If there's an error, it's probably because the splash screen has already been hidden */
});

const CustomSplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  
  // Get color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Load fonts if needed
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Start animations when component mounts
  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Fade in the text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Wait a bit before finishing
      Animated.delay(1000),
    ]).start(() => {
      // Animation complete, hide splash screen
      SplashScreen.hideAsync().catch(() => {
        /* If there's an error, it's probably because the splash screen has already been hidden */
      });
      // Call the onFinish callback
      onFinish();
    });
  }, [fadeAnim, scaleAnim, textFadeAnim, onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? heavyMetal : white }]}>
      {/* Background pattern */}
      <View style={styles.backgroundPattern}>
        <Image 
          source={require('../../assets/images/links.png')} 
          style={styles.patternImage}
          resizeMode="cover"
        />
      </View>
      
      {/* Centered logo */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image 
          source={require('../../assets/images/w-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.View style={[styles.textContainer, { opacity: textFadeAnim }]}>
        <ThemedText style={styles.text}>WITH US</ThemedText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.15,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default CustomSplashScreen;
