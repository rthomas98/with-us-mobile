import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#F5F5F5';
const mediumGray = '#D3D3D3';
const darkGray = '#666666';

// Order status steps
const orderStatusSteps = [
  {
    id: 'packing',
    title: 'Packing',
    address: '2336 Jack Warren Rd, Delta Junction, Alaska 99737, USA',
  },
  {
    id: 'picked',
    title: 'Picked',
    address: '2417 Tongass Ave #111, Ketchikan, Alaska 99901, USA',
  },
  {
    id: 'transit',
    title: 'In Transit',
    address: '16 Rr 2, Ketchikan, Alaska 99901, USA',
  },
  {
    id: 'delivered',
    title: 'Delivered',
    address: '925 S Chugach St #APT 10, Alaska 99645, USA',
  },
];

// Delivery person
const deliveryPerson = {
  name: 'Jacob Jones',
  title: 'Delivery Guy',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  phone: '+1234567890',
};

// Sample map coordinates
const mapCoordinates = {
  origin: { latitude: 55.6761, longitude: 12.5683 },
  destination: { latitude: 55.6761, longitude: 12.6683 },
  current: { latitude: 55.6761, longitude: 12.6183 },
  region: {
    latitude: 55.6761,
    longitude: 12.6183,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};

export default function TrackOrderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<string>('transit');

  useEffect(() => {
    // Simulate loading order data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle call delivery person
  const handleCallDeliveryPerson = () => {
    Linking.openURL(`tel:${deliveryPerson.phone}`);
  };

  // Render status timeline
  const renderStatusTimeline = () => {
    return (
      <View style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Order Status</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={black} />
          </TouchableOpacity>
        </View>

        {orderStatusSteps.map((step, index) => {
          const isActive = 
            (step.id === 'packing' && ['packing', 'picked', 'transit', 'delivered'].includes(currentStatus)) ||
            (step.id === 'picked' && ['picked', 'transit', 'delivered'].includes(currentStatus)) ||
            (step.id === 'transit' && ['transit', 'delivered'].includes(currentStatus)) ||
            (step.id === 'delivered' && ['delivered'].includes(currentStatus));
          
          const isLastItem = index === orderStatusSteps.length - 1;

          return (
            <View key={step.id} style={styles.statusStep}>
              <View style={styles.statusIconContainer}>
                <View style={[
                  styles.statusDot,
                  isActive ? styles.activeDot : styles.inactiveDot
                ]}>
                  {isActive && <View style={styles.innerDot} />}
                </View>
                {!isLastItem && (
                  <View style={[
                    styles.statusLine,
                    isActive && index < orderStatusSteps.findIndex(s => s.id === currentStatus)
                      ? styles.activeLine
                      : styles.inactiveLine
                  ]} />
                )}
              </View>
              
              <View style={styles.statusContent}>
                <Text style={[
                  styles.statusStepTitle,
                  isActive ? styles.activeStepTitle : styles.inactiveStepTitle
                ]}>
                  {step.title}
                </Text>
                <Text style={styles.statusAddress} numberOfLines={1}>
                  {step.address}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.deliveryPersonContainer}>
          <Image 
            source={{ uri: deliveryPerson.avatar }} 
            style={styles.avatar}
          />
          <View style={styles.deliveryPersonInfo}>
            <Text style={styles.deliveryPersonName}>{deliveryPerson.name}</Text>
            <Text style={styles.deliveryPersonTitle}>{deliveryPerson.title}</Text>
          </View>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleCallDeliveryPerson}
          >
            <Ionicons name="call" size={24} color={white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={black} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => router.push('/notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>
      
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={mapCoordinates.region}
        >
          {/* Origin Marker */}
          <Marker coordinate={mapCoordinates.origin}>
            <View style={styles.markerContainer}>
              <Ionicons name="home" size={20} color={white} />
            </View>
          </Marker>
          
          {/* Destination Marker */}
          <Marker coordinate={mapCoordinates.destination}>
            <View style={styles.markerContainer}>
              <Ionicons name="location" size={20} color={white} />
            </View>
          </Marker>
          
          {/* Current Location Marker (Delivery) */}
          <Marker coordinate={mapCoordinates.current}>
            <View style={styles.deliveryMarkerContainer}>
              <Ionicons name="car" size={20} color={white} />
            </View>
          </Marker>
          
          {/* Route Line */}
          <Polyline
            coordinates={[
              mapCoordinates.origin,
              mapCoordinates.current,
              mapCoordinates.destination,
            ]}
            strokeColor={black}
            strokeWidth={3}
            lineDashPattern={[1, 3]}
          />
        </MapView>
      </View>
      
      {/* Status Timeline */}
      {renderStatusTimeline()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: '40%',
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    backgroundColor: black,
    borderRadius: 20,
    padding: 6,
  },
  deliveryMarkerContainer: {
    backgroundColor: '#4285F4',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: white,
  },
  statusContainer: {
    flex: 1,
    backgroundColor: white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    shadowColor: black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  statusStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statusIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: black,
  },
  inactiveDot: {
    backgroundColor: white,
    borderWidth: 1,
    borderColor: mediumGray,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: white,
  },
  statusLine: {
    width: 2,
    height: 40,
    marginVertical: 4,
  },
  activeLine: {
    backgroundColor: black,
  },
  inactiveLine: {
    backgroundColor: mediumGray,
  },
  statusContent: {
    flex: 1,
  },
  statusStepTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  activeStepTitle: {
    fontWeight: '600',
    color: black,
  },
  inactiveStepTitle: {
    fontWeight: '400',
    color: darkGray,
  },
  statusAddress: {
    fontSize: 14,
    color: mediumGray,
  },
  deliveryPersonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: lightGray,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: lightGray,
  },
  deliveryPersonInfo: {
    flex: 1,
    marginLeft: 16,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
  },
  deliveryPersonTitle: {
    fontSize: 14,
    color: mediumGray,
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
