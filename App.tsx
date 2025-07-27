import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, SafeAreaView, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import MapComponent from './MapComponent'; // Will auto-select .web.tsx on web
import { TACO_WEEK_RESTAURANTS } from './data/restaurants';


export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is needed to show your position on the map');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }
  }, []);

  const openInMaps = (restaurant: any) => {
    if (Platform.OS === 'web') {
      const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;
      Linking.openURL(url);
    } else {
      const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${restaurant.latitude},${restaurant.longitude}`;
      const label = restaurant.name;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      });

      Linking.openURL(url!);
    }
  };

  const toggleFavorite = (vendorId: string) => {
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const filteredRestaurants = TACO_WEEK_RESTAURANTS.filter(restaurant => {
    if (showFavoritesOnly && !favorites.includes(restaurant.id)) return false;
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return restaurant.name.toLowerCase().includes(searchLower) ||
             restaurant.address.toLowerCase().includes(searchLower) ||
             (restaurant.description?.toLowerCase().includes(searchLower) || false) ||
             (restaurant.featuredItem?.toLowerCase().includes(searchLower) || false);
    }
    return true;
  });


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🌮 Chattanooga Taco Fest</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tacos, ingredients..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, showFavoritesOnly && styles.filterActive]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Text style={[styles.filterText, showFavoritesOnly && styles.filterTextActive]}>
            ❤️ Show Favorites Only
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.dateText}>🌮 July 28 - August 3, 2025</Text>
      </View>

      <MapComponent vendors={filteredRestaurants} onVendorPress={setSelectedVendor} />

      <ScrollView style={styles.vendorList}>
        {filteredRestaurants.map(restaurant => (
          <View key={restaurant.id} style={styles.vendorCard}>
            <View style={styles.vendorHeader}>
              <Text style={styles.vendorName}>{restaurant.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(restaurant.id)}>
                <Text style={styles.favoriteButton}>
                  {favorites.includes(restaurant.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.vendorDescription}>{restaurant.address}</Text>
            
            {restaurant.description && (
              <Text style={styles.restaurantInfo}>{restaurant.description}</Text>
            )}
            
            <View style={styles.featuredItemContainer}>
              <Text style={styles.featuredLabel}>Featured $4 Taco:</Text>
              <Text style={styles.featuredItem}>
                {restaurant.featuredItem || '🌮 Coming Soon! Check back closer to the event'}
              </Text>
            </View>
            
            <View style={styles.vendorActions}>
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => openInMaps(restaurant)}
              >
                <Text style={styles.directionsText}>📍 Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    backgroundColor: '#FF6B6B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f8f8f8',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
  },
  map: {
    height: 300,
  },
  vendorList: {
    flex: 1,
    padding: 10,
  },
  vendorCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteButton: {
    fontSize: 24,
  },
  vendorDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  restaurantInfo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 10,
  },
  featuredItemContainer: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  featuredLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 2,
  },
  featuredItem: {
    fontSize: 14,
    color: '#856404',
  },
  vendorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionsButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  directionsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});