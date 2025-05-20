
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VenueFiltersProps {
  onFilter: (filters: any) => void;
}

const VenueFilters: React.FC<VenueFiltersProps> = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [capacity, setCapacity] = useState([0, 500]);
  const [filters, setFilters] = useState({
    search: '',
    categories: [] as string[],
    amenities: [] as string[],
    priceRange: [0, 5000],
    capacity: [0, 500],
  });
  
  const categories = [
    'Wedding', 'Birthday', 'Corporate', 'Reception', 'Party', 'Conference', 'Other'
  ];
  
  const amenities = [
    'Catering', 'Parking', 'Wifi', 'Audio/Visual', 'Outdoor Space', 'Accessible', 'Bar'
  ];
  
  const handleCategoryToggle = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return {
        ...prev,
        amenities: newAmenities
      };
    });
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setFilters(prev => ({
      ...prev,
      priceRange: value
    }));
  };
  
  const handleCapacityChange = (value: number[]) => {
    setCapacity(value);
    setFilters(prev => ({
      ...prev,
      capacity: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  const handleReset = () => {
    setPriceRange([0, 5000]);
    setCapacity([0, 500]);
    setFilters({
      search: '',
      categories: [],
      amenities: [],
      priceRange: [0, 5000],
      capacity: [0, 500],
    });
    onFilter({
      search: '',
      categories: [],
      amenities: [],
      priceRange: [0, 5000],
      capacity: [0, 500],
    });
  };
  
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-md border border-champagne-100 dark:border-champagne-900/40 mb-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 border-b border-champagne-100 dark:border-champagne-900/40">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center border-blush-200 text-blush-500 dark:border-blush-800 dark:text-blush-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              <X size={18} className="mr-2" />
              Close Filters
            </>
          ) : (
            <>
              <Filter size={18} className="mr-2" />
              Open Filters
            </>
          )}
        </Button>
      </div>
      
      {/* Search Bar (Always Visible) */}
      <div className="p-4 border-b border-champagne-100 dark:border-champagne-900/40">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search venues..."
              className="elegant-input pl-10"
              value={filters.search}
              onChange={handleSearch}
            />
          </div>
          <Button className="bg-blush-400 hover:bg-blush-500 text-white">
            Search
          </Button>
        </form>
      </div>
      
      {/* Filter Options */}
      <div className={`${isOpen || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 border-b border-champagne-100 dark:border-champagne-900/40">
          <h3 className="font-medium mb-3">Event Type</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.categories.includes(category)
                    ? 'bg-blush-100 text-blush-800 dark:bg-blush-900 dark:text-blush-200'
                    : 'bg-champagne-50 text-champagne-800 dark:bg-champagne-900/50 dark:text-champagne-200 hover:bg-champagne-100 dark:hover:bg-champagne-900'
                }`}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-b border-champagne-100 dark:border-champagne-900/40">
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              value={priceRange}
              min={0}
              max={5000}
              step={50}
              onValueChange={handlePriceChange}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-champagne-100 dark:border-champagne-900/40">
          <h3 className="font-medium mb-3">Capacity</h3>
          <div className="px-2">
            <Slider
              value={capacity}
              min={0}
              max={500}
              step={10}
              onValueChange={handleCapacityChange}
              className="my-6"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{capacity[0]} guests</span>
              <span>{capacity[1]}+ guests</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b border-champagne-100 dark:border-champagne-900/40">
          <h3 className="font-medium mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-champagne-300 text-blush-500 focus:ring-blush-400 dark:border-champagne-700 dark:focus:ring-blush-600"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="p-4 flex justify-between">
          <Button
            variant="outline"
            className="border-champagne-200 text-champagne-800 hover:bg-champagne-50 dark:border-champagne-800 dark:text-champagne-200 dark:hover:bg-champagne-900/20"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
          <Button 
            className="bg-blush-400 hover:bg-blush-500 text-white"
            onClick={handleSubmit}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueFilters;
