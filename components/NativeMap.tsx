import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';

interface NativeMapProps {
  vendors: Array<{
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
  }>;
  onVendorPress?: (vendor: any) => void;
}

export default function NativeMap({ vendors, onVendorPress }: NativeMapProps) {
  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: 35.0456,
        longitude: -85.3097,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={true}
    >
      {vendors.map(vendor => (
        <Marker
          key={vendor.id}
          coordinate={{ latitude: vendor.latitude, longitude: vendor.longitude }}
          title={vendor.name}
          description={vendor.description}
          onPress={() => onVendorPress?.(vendor)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 300,
  },
});