
import React, { useState, useCallback, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Navigation } from 'lucide-react';
import { ALGERIA_CITIES } from '@/constants/venue';

// Import Leaflet CSS - this should work once leaflet is properly installed
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VenueFormData {
  name: string;
  description: string;
  capacity: number;
  city: string;
  address: string;
  category: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
  latitude?: number;
  longitude?: number;
}

interface LocationSectionProps {
  register: UseFormRegister<VenueFormData>;
  errors: FieldErrors<VenueFormData>;
  setValue: UseFormSetValue<VenueFormData>;
  watch: UseFormWatch<VenueFormData>;
}

// Algeria bounds for validation
const ALGERIA_BOUNDS = {
  north: 37.5,
  south: 18.9,
  east: 12.0,
  west: -8.7
};

// Default center (Algiers)
const DEFAULT_CENTER: [number, number] = [36.7538, 3.0588];

const LocationSection: React.FC<LocationSectionProps> = ({
  register,
  errors,
  setValue,
  watch
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);

  const selectedCity = watch('city');
  const currentLatitude = watch('latitude');
  const currentLongitude = watch('longitude');

  // Register latitude and longitude fields
  useEffect(() => {
    register('latitude');
    register('longitude');
  }, [register]);

  // Update position when coordinates change
  useEffect(() => {
    if (currentLatitude && currentLongitude) {
      setPosition([currentLatitude, currentLongitude]);
    }
  }, [currentLatitude, currentLongitude]);

  const isWithinAlgeria = (lat: number, lng: number): boolean => {
    return lat >= ALGERIA_BOUNDS.south && lat <= ALGERIA_BOUNDS.north &&
           lng >= ALGERIA_BOUNDS.west && lng <= ALGERIA_BOUNDS.east;
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const addressParts = data.display_name.split(', ');
        const fullAddress = addressParts.slice(0, 3).join(', ');
        setValue('address', fullAddress);
        
        // Try to match city with our predefined list
        const cityFromResult = data.address?.city || data.address?.town || data.address?.village;
        if (cityFromResult) {
          const matchedCity = ALGERIA_CITIES.find(city => 
            city.toLowerCase().includes(cityFromResult.toLowerCase()) ||
            cityFromResult.toLowerCase().includes(city.toLowerCase())
          );
          if (matchedCity) {
            setValue('city', matchedCity);
          }
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const searchAddress = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Algeria')}&format=json&addressdetails=1&limit=5&accept-language=en`
      );
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Address search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAddress(searchQuery);
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    if (isWithinAlgeria(lat, lng)) {
      setPosition([lat, lng]);
      setValue('latitude', lat);
      setValue('longitude', lng);
      setValue('address', result.display_name.split(', ').slice(0, 3).join(', '));
      
      // Try to match city
      const cityFromResult = result.address?.city || result.address?.town || result.address?.village;
      if (cityFromResult) {
        const matchedCity = ALGERIA_CITIES.find(city => 
          city.toLowerCase().includes(cityFromResult.toLowerCase()) ||
          cityFromResult.toLowerCase().includes(city.toLowerCase())
        );
        if (matchedCity) {
          setValue('city', matchedCity);
        }
      }
      
      setSearchResults([]);
      setSearchQuery('');
      setShowMap(true);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (isWithinAlgeria(lat, lng)) {
            setPosition([lat, lng]);
            setValue('latitude', lat);
            setValue('longitude', lng);
            reverseGeocode(lat, lng);
            setShowMap(true);
          } else {
            alert('Your current location is outside Algeria. Please select a location within Algeria.');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your current location. Please search for an address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        if (isWithinAlgeria(lat, lng)) {
          setPosition([lat, lng]);
          setValue('latitude', lat);
          setValue('longitude', lng);
          reverseGeocode(lat, lng);
        } else {
          alert('Please select a location within Algeria.');
        }
      },
    });
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location & Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Search */}
        <div className="space-y-2">
          <Label>Search Address</Label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an address in Algeria..."
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching} size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button type="button" onClick={getCurrentLocation} size="sm" variant="outline">
              <Navigation className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 text-sm"
                >
                  {result.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City Selection */}
        <div>
          <Label htmlFor="city">City *</Label>
          <Select onValueChange={(value) => setValue('city', value)} value={selectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select a city in Algeria" />
            </SelectTrigger>
            <SelectContent>
              {ALGERIA_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        {/* Full Address */}
        <div>
          <Label htmlFor="address">Full Address *</Label>
          <Input
            id="address"
            {...register('address', { required: 'Address is required' })}
            placeholder="Enter the complete address"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        {/* Coordinates Display */}
        {position && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input value={position[0].toFixed(6)} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input value={position[1].toFixed(6)} readOnly className="bg-gray-50" />
            </div>
          </div>
        )}

        {/* Toggle Map Button */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowMap(!showMap)}
          className="w-full"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>

        {/* Map */}
        {showMap && (
          <div className="h-80 rounded-md overflow-hidden border">
            <MapContainer
              center={position || DEFAULT_CENTER}
              zoom={position ? 15 : 6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler />
              {position && (
                <Marker 
                  position={position}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const newPos = marker.getLatLng();
                      if (isWithinAlgeria(newPos.lat, newPos.lng)) {
                        setPosition([newPos.lat, newPos.lng]);
                        setValue('latitude', newPos.lat);
                        setValue('longitude', newPos.lng);
                        reverseGeocode(newPos.lat, newPos.lng);
                      } else {
                        marker.setLatLng(position);
                        alert('Please keep the marker within Algeria.');
                      }
                    }
                  }}
                />
              )}
            </MapContainer>
          </div>
        )}

        <p className="text-sm text-gray-600">
          💡 You can search for an address, use your current location, or click on the map to set the exact position.
        </p>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
