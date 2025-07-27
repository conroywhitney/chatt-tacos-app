export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  featuredItem?: string;
  description?: string;
  website?: string;
  menuLink?: string;
}

// Chattanooga Taco Week: July 28 - August 3, 2025
export const TACO_WEEK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Taco Mamacita (Northshore)',
    address: '109 N Market St, Chattanooga, TN 37405',
    latitude: 35.0576,
    longitude: -85.3096,
    description: 'Fresh ingredients and creative taco combinations',
  },
  {
    id: '2',
    name: '423 Taco',
    address: '212 W 8th St, Chattanooga, TN 37402',
    latitude: 35.0468,
    longitude: -85.3134,
    description: 'Local taco joint with authentic flavors',
  },
  {
    id: '3',
    name: 'Five Wits Brewing Co.',
    address: '1501 Long Street, Chattanooga, TN',
    latitude: 35.0324,
    longitude: -85.3013,
    description: 'Craft brewery with taco offerings',
  },
  {
    id: '4',
    name: 'Agave & Rye',
    address: '185 Chestnut St, Chattanooga, TN 37402',
    latitude: 35.0470,
    longitude: -85.3089,
    description: 'Epic tacos with creative toppings',
  },
  {
    id: '5',
    name: 'White Duck Taco Chattanooga',
    address: '1519 McCallie Ave, Chattanooga, TN 37404',
    latitude: 35.0411,
    longitude: -85.2826,
    description: 'Unique taco creations with local ingredients',
  },
  {
    id: '6',
    name: 'Bollywood Tacos and Bar',
    address: '203 E Main St, Chattanooga, TN 37408',
    latitude: 35.0488,
    longitude: -85.3027,
    description: 'Indian-Mexican fusion tacos',
  },
  {
    id: '7',
    name: 'Oddstory Brewing Co (Central)',
    address: '1604 Central Ave, Chattanooga, TN 37408',
    latitude: 35.0394,
    longitude: -85.2965,
    description: 'Craft beer and creative tacos',
  },
  {
    id: '8',
    name: 'Taco Mamacita (Hamilton Place)',
    address: '2031 Hamilton Pl Blvd, Chattanooga, TN 37421',
    latitude: 35.0418,
    longitude: -85.1574,
    description: 'Fresh ingredients and creative taco combinations',
  },
];

// Map categories for dietary restrictions (to be updated when menu info available)
export const DIETARY_TAGS = {
  vegetarian: '🥬',
  vegan: '🌱',
  glutenFree: '🌾',
  spicy: '🌶️',
};