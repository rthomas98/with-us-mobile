import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemedText } from '../ThemedText';

// Import SVG assets as strings
// We need to read the SVG files as strings since we can't directly import them as React components
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// SVG file paths
const LINKS_SVG_PATH = '../../assets/images/links.svg';
const LOGO_SVG_PATH = '../../assets/images/w-logo.svg';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* If there's an error, it's probably because the splash screen has already been hidden */
});

const CustomSplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  
  // SVG content refs
  const [linksXml, setLinksXml] = React.useState<string | null>(null);
  const [logoXml, setLogoXml] = React.useState<string | null>(null);
  
  // Get color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Load fonts if needed
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Load SVG files
  useEffect(() => {
    const loadSvgAssets = async () => {
      try {
        // Load the SVG files
        const linksAsset = Asset.fromModule(require(LINKS_SVG_PATH));
        const logoAsset = Asset.fromModule(require(LOGO_SVG_PATH));
        
        await Promise.all([linksAsset.downloadAsync(), logoAsset.downloadAsync()]);
        
        // Read the SVG files as text
        const linksContent = await FileSystem.readAsStringAsync(linksAsset.localUri || '');
        const logoContent = await FileSystem.readAsStringAsync(logoAsset.localUri || '');
        
        setLinksXml(linksContent);
        setLogoXml(logoContent);
      } catch (error) {
        console.error('Error loading SVG assets:', error);
        // Fallback to direct require if the above method fails
        try {
          setLinksXml(require(LINKS_SVG_PATH));
          setLogoXml(require(LOGO_SVG_PATH));
        } catch (e) {
          console.error('Fallback loading failed:', e);
        }
      }
    };
    
    loadSvgAssets();
  }, []);

  useEffect(() => {
    // Start animations when component mounts and assets are loaded
    const startAnimations = async () => {
      // Wait for fonts and SVGs to load
      if (!fontsLoaded || !linksXml || !logoXml) return;
      
      // Hide the native splash screen
      await SplashScreen.hideAsync();
      
      // Start logo animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Start text animation after logo animation
      setTimeout(() => {
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 400);
      
      // After animations complete, trigger onFinish callback
      setTimeout(() => {
        onFinish();
      }, 2500); // Show splash for 2.5 seconds
    };

    startAnimations();
  }, [fadeAnim, scaleAnim, textFadeAnim, onFinish, fontsLoaded, linksXml, logoXml]);

  // If assets aren't loaded yet, show a blank screen
  if (!linksXml || !logoXml) {
    return (
      <View style={[
        styles.container, 
        { backgroundColor: isDarkMode ? '#222720' : '#ffffff' }
      ]} />
    );
  }

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDarkMode ? '#222720' : '#ffffff' }
    ]}>
      {/* Background pattern using links.svg */}
      <View style={styles.backgroundPattern}>
        <SvgXml xml={linksXml} width={width * 1.2} height={height * 1.2} />
      </View>
      
      {/* Centered logo with animation */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <SvgXml xml={logoXml} width={200} height={200} />
        
        {/* Brand name with animation */}
        <Animated.View style={{ opacity: textFadeAnim, marginTop: 20 }}>
          <ThemedText style={styles.brandText}>WITH US</ThemedText>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    top: -50,
    left: -50,
    opacity: 0.15, // Subtle background
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default CustomSplashScreen;
