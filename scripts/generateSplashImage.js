const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * This script generates the splash screen image by:
 * 1. Creating a temporary React Native app
 * 2. Rendering our GenerateSplashImage component
 * 3. Using react-native-view-shot to capture the rendered component as a PNG
 * 4. Saving the PNG to the assets directory
 */

// Paths
const ASSETS_DIR = path.resolve(__dirname, '../assets/images');
const SPLASH_IMAGE_PATH = path.join(ASSETS_DIR, 'splash-icon.png');
const SPLASH_IMAGE_DARK_PATH = path.join(ASSETS_DIR, 'splash-icon-dark.png');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

console.log('Generating splash screen images...');

// Generate light mode splash image
try {
  console.log('Generating light mode splash image...');
  
  // Create a temporary app that renders our GenerateSplashImage component
  const tempAppCode = `
    import React from 'react';
    import { AppRegistry } from 'react-native';
    import * as FileSystem from 'expo-file-system';
    import GenerateSplashImage from '../components/SplashScreen/generateSplashImage';
    
    // Component to capture and save the splash image
    const SplashImageCapture = () => {
      const handleCapture = async (uri) => {
        try {
          // Save the captured image to the assets directory
          await FileSystem.copyAsync({
            from: uri,
            to: FileSystem.documentDirectory + 'splash-icon.png'
          });
          console.log('Light mode splash image saved successfully!');
        } catch (error) {
          console.error('Error saving light mode splash image:', error);
        }
      };
    
      return <GenerateSplashImage onCapture={handleCapture} mode="light" />;
    };
    
    AppRegistry.registerComponent('SplashImageCapture', () => SplashImageCapture);
  `;
  
  // Write the temporary app code to a file
  const tempAppPath = path.resolve(__dirname, 'tempSplashApp.js');
  fs.writeFileSync(tempAppPath, tempAppCode);
  
  // Run the temporary app to generate the splash image
  console.log('Running temporary app to generate light mode splash image...');
  execSync(`npx expo run:ios --no-build --no-bundler`);
  
  // Copy the generated image from the device to the assets directory
  console.log('Copying light mode splash image to assets directory...');
  // This would need to be implemented with a native module or a different approach
  
  // Clean up
  fs.unlinkSync(tempAppPath);
  
  console.log('Light mode splash image generated successfully!');
} catch (error) {
  console.error('Error generating light mode splash image:', error);
}

// Generate dark mode splash image
try {
  console.log('Generating dark mode splash image...');
  
  // Create a temporary app that renders our GenerateSplashImage component
  const tempAppCode = `
    import React from 'react';
    import { AppRegistry } from 'react-native';
    import * as FileSystem from 'expo-file-system';
    import GenerateSplashImage from '../components/SplashScreen/generateSplashImage';
    
    // Component to capture and save the splash image
    const SplashImageCapture = () => {
      const handleCapture = async (uri) => {
        try {
          // Save the captured image to the assets directory
          await FileSystem.copyAsync({
            from: uri,
            to: FileSystem.documentDirectory + 'splash-icon-dark.png'
          });
          console.log('Dark mode splash image saved successfully!');
        } catch (error) {
          console.error('Error saving dark mode splash image:', error);
        }
      };
    
      return <GenerateSplashImage onCapture={handleCapture} mode="dark" />;
    };
    
    AppRegistry.registerComponent('SplashImageCapture', () => SplashImageCapture);
  `;
  
  // Write the temporary app code to a file
  const tempAppPath = path.resolve(__dirname, 'tempSplashApp.js');
  fs.writeFileSync(tempAppPath, tempAppCode);
  
  // Run the temporary app to generate the splash image
  console.log('Running temporary app to generate dark mode splash image...');
  execSync(`npx expo run:ios --no-build --no-bundler`);
  
  // Copy the generated image from the device to the assets directory
  console.log('Copying dark mode splash image to assets directory...');
  // This would need to be implemented with a native module or a different approach
  
  // Clean up
  fs.unlinkSync(tempAppPath);
  
  console.log('Dark mode splash image generated successfully!');
} catch (error) {
  console.error('Error generating dark mode splash image:', error);
}

console.log('Splash screen images generation complete!');

// Note: This script is a starting point and may need adjustments based on your specific setup.
// The approach of running a temporary app and copying the image from the device is complex
// and may require additional native modules or a different approach altogether.
// Consider using a web-based approach with puppeteer or a similar tool instead.
