import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/Button';

// Brand colors
const zorba = '#A59D94';
const white = '#ffffff';
const heavyMetal = '#222720';
const dawn = '#A9A39A';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// SVG file path
const LOGO_SVG_PATH = '../assets/images/w-logo.svg';

export default function WelcomeScreen() {
  // SVG content state
  const [logoXml, setLogoXml] = useState<string | null>(null);

  // Load SVG file
  useEffect(() => {
    const loadSvgAssets = async () => {
      try {
        // Load the SVG file
        const logoAsset = Asset.fromModule(require(LOGO_SVG_PATH));
        
        await logoAsset.downloadAsync();
        
        // Read the SVG file as text
        const logoContent = await FileSystem.readAsStringAsync(logoAsset.localUri || '');
        
        setLogoXml(logoContent);
      } catch (error) {
        console.error('Error loading SVG assets:', error);
        // Fallback to direct require if the above method fails
        try {
          setLogoXml(require(LOGO_SVG_PATH));
        } catch (e) {
          console.error('Fallback loading failed:', e);
        }
      }
    };
    
    loadSvgAssets();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      
      {/* Background pattern */}
      <Image 
        source={require('@/assets/images/lines-right.png')}
        style={styles.backgroundPattern}
        resizeMode="cover"
      />
      
      {/* Main content */}
      <SafeAreaView style={styles.content}>
        {/* Top section with text */}
        <View style={styles.textContainer}>
          <ThemedText style={styles.headingText}>
            Define yourself in your unique way.
          </ThemedText>
        </View>
        
        {/* Middle section with logo */}
        <View style={styles.imageContainer}>
          {logoXml && (
            <SvgXml 
              xml={logoXml} 
              width={width * 0.6} 
              height={width * 0.6} 
            />
          )}
        </View>
        
        {/* Bottom section with buttons */}
        <View style={styles.buttonContainer}>
          {/* Login button */}
          <Link href="/(auth)/login" asChild>
            <Button 
              label="Login" 
              variant="primary" 
              size="large" 
              style={styles.button}
              fullWidth
            />
          </Link>
          
          {/* Shop as Guest button */}
          <Link href="/(tabs)" asChild>
            <Button 
              label="Shop as Guest" 
              variant="outline" 
              size="large" 
              style={styles.button}
              fullWidth
            />
          </Link>
          
          {/* Indicator dots */}
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  backgroundPattern: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
  },
  headingText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: heavyMetal,
    lineHeight: 48,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  button: {
    marginBottom: 16,
    borderRadius: 30,
    height: 56,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: zorba,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: heavyMetal,
    opacity: 1,
  },
});
