/* ============================================================
   useCity.js — City Selection Composable
   Module-level singleton so selected city is shared globally.
   ============================================================ */
import { ref } from 'vue'

const POPULAR_CITIES = [
  { name: 'Mumbai', emoji: '🏛️', icon: 'gateway' },
  { name: 'Delhi', emoji: '🕍', icon: 'indiagate' },
  { name: 'Bengaluru', emoji: '🌆', icon: 'palace' },
  { name: 'Hyderabad', emoji: '🕌', icon: 'charminar' },
  { name: 'Chennai', emoji: '🏖️', icon: 'lighthouse' },
  { name: 'Kolkata', emoji: '🌉', icon: 'bridge' },
  { name: 'Pune', emoji: '🏰', icon: 'fort' },
  { name: 'Ahmedabad', emoji: '🕌', icon: 'mosque' },
  { name: 'Chandigarh', emoji: '🌿', icon: 'capitol' },
  { name: 'Kochi', emoji: '🌴', icon: 'nets' }
]

const ALL_CITIES = [
  ...POPULAR_CITIES.map(c => c.name),
  'Jaipur', 'Surat', 'Lucknow', 'Nagpur', 'Bhopal',
  'Visakhapatnam', 'Indore', 'Thane', 'Coimbatore', 'Vadodara'
]

// Module-level singleton — shared across all component instances
const selectedCity = ref(localStorage.getItem('cinevault-city') || 'Mumbai')

export function useCity() {
  function setCity(cityName) {
    selectedCity.value = cityName
    localStorage.setItem('cinevault-city', cityName)
  }

  return {
    selectedCity,
    popularCities: POPULAR_CITIES,
    allCities: ALL_CITIES,
    setCity
  }
}
