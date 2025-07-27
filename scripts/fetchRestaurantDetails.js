// Script to help gather more restaurant details
// Run with: node scripts/fetchRestaurantDetails.js

const restaurants = [
  {
    name: 'Taco Mamacita (Northshore)',
    address: '109 N Market St, Chattanooga, TN 37405',
    searchQuery: 'Taco Mamacita Northshore Chattanooga menu'
  },
  {
    name: '423 Taco',
    address: '212 W 8th St, Chattanooga, TN 37402',
    searchQuery: '423 Taco Chattanooga menu'
  },
  {
    name: 'Five Wits Brewing Co.',
    address: '1501 Long Street, Chattanooga, TN',
    searchQuery: 'Five Wits Brewing Chattanooga tacos'
  },
  {
    name: 'Agave & Rye',
    address: '185 Chestnut St, Chattanooga, TN 37402',
    searchQuery: 'Agave and Rye Chattanooga tacos menu'
  },
  {
    name: 'White Duck Taco Chattanooga',
    address: '1519 McCallie Ave, Chattanooga, TN 37404',
    searchQuery: 'White Duck Taco Chattanooga menu'
  },
  {
    name: 'Bollywood Tacos and Bar',
    address: '203 E Main St, Chattanooga, TN 37408',
    searchQuery: 'Bollywood Tacos Chattanooga menu'
  },
  {
    name: 'Oddstory Brewing Co (Central)',
    address: '1604 Central Ave, Chattanooga, TN 37408',
    searchQuery: 'Oddstory Brewing Chattanooga tacos'
  },
  {
    name: 'Taco Mamacita (Hamilton Place)',
    address: '2031 Hamilton Pl Blvd, Chattanooga, TN 37421',
    searchQuery: 'Taco Mamacita Hamilton Place Chattanooga'
  }
];

console.log('Search these queries to find menu information:');
console.log('=============================================\n');

restaurants.forEach((restaurant, index) => {
  console.log(`${index + 1}. ${restaurant.name}`);
  console.log(`   Address: ${restaurant.address}`);
  console.log(`   Search: "${restaurant.searchQuery}"`);
  console.log('');
});

console.log('\nLook for:');
console.log('- Popular taco items under $4');
console.log('- Vegetarian/vegan options');
console.log('- Specialty tacos');
console.log('- Restaurant websites or social media');