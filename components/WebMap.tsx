import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Linking from 'expo-linking';

interface WebMapProps {
  vendors: Array<{
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
  }>;
  onVendorPress?: (vendor: any) => void;
}

export default function WebMap({ vendors, onVendorPress }: WebMapProps) {
  const openInGoogleMaps = () => {
    // Center on Chattanooga with all vendor markers
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const waypoints = vendors.map(v => `${v.latitude},${v.longitude}`).join('|');
    const url = `${baseUrl}&destination=${vendors[0].latitude},${vendors[0].longitude}&waypoints=${waypoints}`;
    Linking.openURL(url);
  };

  // Create Google Maps embed URL with markers
  const mapUrl = useMemo(() => {
    const centerLat = 35.0456;
    const centerLng = -85.3097;
    
    // Create markers string for each vendor
    const markers = vendors.map((vendor, index) => 
      `&markers=color:red%7Clabel:${index + 1}%7C${vendor.latitude},${vendor.longitude}`
    ).join('');
    
    return `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=15&output=embed${markers}`;
  }, [vendors]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
        />
        <TouchableOpacity style={styles.fullscreenButton} onPress={openInGoogleMaps}>
          <Text style={styles.fullscreenText}>🗺️ Open Full Map</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal style={styles.vendorPins} showsHorizontalScrollIndicator={false}>
        {vendors.map((vendor, index) => (
          <TouchableOpacity
            key={vendor.id}
            style={styles.pin}
            onPress={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${vendor.latitude},${vendor.longitude}`;
              Linking.openURL(url);
            }}
          >
            <Text style={styles.pinNumber}>{index + 1}</Text>
            <Text style={styles.pinName}>{vendor.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative' as any,
  },
  fullscreenButton: {
    position: 'absolute' as any,
    top: 10,
    right: 10,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  fullscreenText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4285F4',
  },
  vendorPins: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 0,
  },
  pin: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pinNumber: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 8,
    fontWeight: 'bold',
    fontSize: 12,
  },
  pinName: {
    fontSize: 14,
    color: '#333',
  },
});