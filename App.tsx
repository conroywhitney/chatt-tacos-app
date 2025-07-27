import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Platform, SafeAreaView, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import MapComponent from './MapComponent'; // Will auto-select .web.tsx on web

interface Vendor {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  ingredients: string[];
  specialties: string[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

// Mock vendor data - replace with real data
const VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Taco Libre',
    description: 'Authentic street tacos with house-made tortillas',
    latitude: 35.0456,
    longitude: -85.3097,
    ingredients: ['beef', 'chicken', 'pork', 'cilantro', 'onion', 'lime'],
    specialties: ['Al Pastor', 'Carnitas'],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
  },
  {
    id: '2',
    name: 'Veggie Vibes',
    description: 'Plant-based Mexican fusion',
    latitude: 35.0467,
    longitude: -85.3085,
    ingredients: ['black beans', 'mushrooms', 'avocado', 'quinoa', 'cashew crema'],
    specialties: ['Mushroom Barbacoa', 'Jackfruit Carnitas'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
  {
    id: '3',
    name: 'La Cocina de Abuela',
    description: 'Traditional family recipes from Oaxaca',
    latitude: 35.0445,
    longitude: -85.3110,
    ingredients: ['mole', 'chicken', 'cheese', 'corn', 'peppers'],
    specialties: ['Mole Negro Tacos', 'Quesadillas'],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
  },
];

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
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

  const openInMaps = (vendor: Vendor) => {
    if (Platform.OS === 'web') {
      const url = `https://www.google.com/maps/search/?api=1&query=${vendor.latitude},${vendor.longitude}`;
      Linking.openURL(url);
    } else {
      const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${vendor.latitude},${vendor.longitude}`;
      const label = vendor.name;
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

  const filteredVendors = VENDORS.filter(vendor => {
    if (filterVegetarian && !vendor.vegetarian) return false;
    if (filterVegan && !vendor.vegan) return false;
    if (filterGlutenFree && !vendor.glutenFree) return false;
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return vendor.name.toLowerCase().includes(searchLower) ||
             vendor.description.toLowerCase().includes(searchLower) ||
             vendor.ingredients.some(ing => ing.toLowerCase().includes(searchLower)) ||
             vendor.specialties.some(spec => spec.toLowerCase().includes(searchLower));
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

      <ScrollView horizontal style={styles.filterContainer} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity 
          style={[styles.filterButton, filterVegetarian && styles.filterActive]}
          onPress={() => setFilterVegetarian(!filterVegetarian)}
        >
          <Text style={[styles.filterText, filterVegetarian && styles.filterTextActive]}>
            🥬 Vegetarian
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filterVegan && styles.filterActive]}
          onPress={() => setFilterVegan(!filterVegan)}
        >
          <Text style={[styles.filterText, filterVegan && styles.filterTextActive]}>
            🌱 Vegan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, filterGlutenFree && styles.filterActive]}
          onPress={() => setFilterGlutenFree(!filterGlutenFree)}
        >
          <Text style={[styles.filterText, filterGlutenFree && styles.filterTextActive]}>
            🌾 Gluten-Free
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <MapComponent vendors={filteredVendors} onVendorPress={setSelectedVendor} />

      <ScrollView style={styles.vendorList}>
        {filteredVendors.map(vendor => (
          <View key={vendor.id} style={styles.vendorCard}>
            <View style={styles.vendorHeader}>
              <Text style={styles.vendorName}>{vendor.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(vendor.id)}>
                <Text style={styles.favoriteButton}>
                  {favorites.includes(vendor.id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.vendorDescription}>{vendor.description}</Text>
            
            <View style={styles.specialtiesContainer}>
              {vendor.specialties.map((specialty, index) => (
                <Text key={index} style={styles.specialty}>
                  🌮 {specialty}
                </Text>
              ))}
            </View>
            
            <View style={styles.vendorActions}>
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => openInMaps(vendor)}
              >
                <Text style={styles.directionsText}>📍 Get Directions</Text>
              </TouchableOpacity>
              
              <View style={styles.dietaryBadges}>
                {vendor.vegetarian && <Text style={styles.badge}>🥬</Text>}
                {vendor.vegan && <Text style={styles.badge}>🌱</Text>}
                {vendor.glutenFree && <Text style={styles.badge}>🌾</Text>}
              </View>
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f8f8f8',
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
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  specialty: {
    fontSize: 14,
    color: '#FF6B6B',
    marginRight: 15,
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
  dietaryBadges: {
    flexDirection: 'row',
  },
  badge: {
    fontSize: 20,
    marginLeft: 5,
  },
});