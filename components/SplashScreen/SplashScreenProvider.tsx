import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomSplashScreen from './index';
import * as SplashScreen from 'expo-splash-screen';

interface SplashScreenProviderProps {
  children: React.ReactNode;
}

const SplashScreenProvider: React.FC<SplashScreenProviderProps> = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);

  // This function will be called when the splash screen animation is complete
  const onSplashScreenFinish = useCallback(() => {
    setIsAppReady(true);
  }, []);

  // Prepare any resources or data that your app needs before rendering
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        // Add any initialization logic here

        // Artificially delay for a smoother startup experience
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  if (!isAppReady) {
    return <CustomSplashScreen onFinish={onSplashScreenFinish} />;
  }

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplashScreenProvider;
