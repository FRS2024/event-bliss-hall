
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import VenueGrid from '@/components/venues/VenueGrid';
import VenueFilters from '@/components/venues/VenueFilters';
import { Venue } from '@/types';
import { getAllVenues } from '@/lib/api';

const VenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const loadVenues = async () => {
      setIsLoading(true);
      try {
        const data = await getAllVenues();
        setVenues(data);
        
        // Apply category filter from URL if present
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          const filtered = data.filter(venue => 
            venue.category.toLowerCase() === categoryParam.toLowerCase()
          );
          setFilteredVenues(filtered);
        } else {
          setFilteredVenues(data);
        }
      } catch (error) {
        console.error('Error loading venues:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVenues();
  }, [searchParams]);
  
  const handleFilter = (filters: any) => {
    let results = [...venues];
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        venue => 
          venue.name.toLowerCase().includes(searchLower) ||
          venue.location.toLowerCase().includes(searchLower) ||
          venue.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      results = results.filter(venue => 
        filters.categories.some((cat: string) => 
          venue.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }
    
    // Filter by price range
    results = results.filter(
      venue => venue.price >= filters.priceRange[0] && venue.price <= filters.priceRange[1]
    );
    
    // Filter by capacity
    results = results.filter(
      venue => venue.capacity >= filters.capacity[0] && venue.capacity <= filters.capacity[1]
    );
    
    // Filter by amenities
    if (filters.amenities.length > 0) {
      results = results.filter(venue => 
        filters.amenities.every((amenity: string) => 
          venue.amenities.includes(amenity)
        )
      );
    }
    
    setFilteredVenues(results);
  };

  // Get the current category from URL for display
  const currentCategory = searchParams.get('category');
  
  return (
    <MainLayout>
      <div className="bg-champagne-50 dark:bg-champagne-900/20 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-script text-4xl md:text-5xl text-center text-blush-500 dark:text-blush-400 mb-4">
            {currentCategory ? `${currentCategory} Venues` : 'Find Your Perfect Venue'}
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            {currentCategory 
              ? `Discover amazing ${currentCategory.toLowerCase()} venues for your special occasion.`
              : 'Browse our extensive collection of stunning venues for weddings, birthdays, corporate events, and special occasions.'
            }
          </p>
        </div>
      </div>
      
      <div className="page-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <VenueFilters onFilter={handleFilter} />
          </div>
          
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {filteredVenues.length} {filteredVenues.length === 1 ? 'venue' : 'venues'} found
                {currentCategory && ` in ${currentCategory}`}
              </p>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-muted-foreground">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="elegant-input text-sm py-1"
                  defaultValue="recommended"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            <VenueGrid venues={filteredVenues} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VenuesPage;
