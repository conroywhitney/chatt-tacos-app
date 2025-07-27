import React from 'react';
import NativeMap from './components/NativeMap';

export default function MapComponent({ vendors, onVendorPress }: any) {
  return <NativeMap vendors={vendors} onVendorPress={onVendorPress} />;
}