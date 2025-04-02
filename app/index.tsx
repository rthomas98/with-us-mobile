import { Redirect } from 'expo-router';

export default function Index() {
  // Use Redirect component which is the recommended way in Expo Router
  return <Redirect href="/(tabs)" />;
}
