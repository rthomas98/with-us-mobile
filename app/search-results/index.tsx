import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SearchResultsScreen() {
  const colorScheme = useColorScheme();
  const { query } = useLocalSearchParams<{ query: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Search Results',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }} 
      />
      <View style={styles.content}>
        <ThemedText style={styles.text}>Search Results</ThemedText>
        {query && <ThemedText style={styles.queryText}>Query: {query}</ThemedText>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  queryText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
