import React from 'react';
import WebMap from './components/WebMap';

export default function MapComponent({ vendors, onVendorPress }: any) {
  return <WebMap vendors={vendors} onVendorPress={onVendorPress} />;
}