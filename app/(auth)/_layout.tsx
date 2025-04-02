import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack 
        initialRouteName="index" 
        screenOptions={{ 
          animation: 'slide_from_right',
          headerShown: false,  
          contentStyle: { backgroundColor: '#ffffff' },
        }} 
      />
    </>
  );
}