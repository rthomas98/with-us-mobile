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
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: Colors[colorScheme ?? 'light'].text,
        }}
      />
    </>
  );
}