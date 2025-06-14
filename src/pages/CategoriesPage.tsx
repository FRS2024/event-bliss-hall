
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CategoryCard from '@/components/categories/CategoryCard';
import CategorySearch from '@/components/categories/CategorySearch';
import { VENUE_CATEGORIES } from '@/constants/venue';
import { getAllVenues } from '@/lib/api';
import { Venue } from '@/types';

const CategoriesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadVenues = async () => {
      setIsLoading(true);
      try {
        const data = await getAllVenues();
        setVenues(data);
      } catch (error) {
        console.error('Error loading venues:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVenues();
  }, []);

  // Calculate category statistics
  const getCategoryStats = (category: string) => {
    const categoryVenues = venues.filter(venue => 
      venue.category.toLowerCase() === category.toLowerCase()
    );
    
    const count = categoryVenues.length;
    const prices = categoryVenues
      .map(venue => venue.price)
      .filter(price => price > 0);
    
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    return { count, minPrice, maxPrice };
  };

  // Filter categories based on search
  const filteredCategories = VENUE_CATEGORIES.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVenues = venues.length;
  const totalCategories = VENUE_CATEGORIES.length;

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-champagne-50 to-blush-50 dark:from-champagne-900/30 dark:to-blush-900/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-script text-4xl md:text-6xl text-blush-500 dark:text-blush-400 mb-6">
            Venue Categories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover the perfect venue for your special occasion. From intimate gatherings to grand celebrations, 
            explore our diverse collection of stunning venues across Algeria.
          </p>
          
          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="font-script text-3xl md:text-4xl text-blush-500 dark:text-blush-400">
                {totalVenues}
              </div>
              <div className="text-sm text-muted-foreground">Total Venues</div>
            </div>
            <div className="text-center">
              <div className="font-script text-3xl md:text-4xl text-champagne-600 dark:text-champagne-400">
                {totalCategories}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="font-script text-3xl md:text-4xl text-gold-600 dark:text-gold-400">
                48
              </div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Search Section */}
        <div className="mb-8">
          <CategorySearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="font-script text-3xl text-center mb-8 text-blush-500 dark:text-blush-400">
            Browse by Category
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="venue-card animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full rounded-t-lg" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category) => {
                const stats = getCategoryStats(category);
                return (
                  <CategoryCard 
                    key={category} 
                    category={category}
                    venueCount={stats.count}
                    priceRange={stats.minPrice > 0 && stats.maxPrice > 0 ? 
                      `${stats.minPrice} - ${stats.maxPrice} DA` : 
                      'Contact for pricing'
                    }
                  />
                );
              })}
            </div>
          )}

          {!isLoading && filteredCategories.length === 0 && (
            <div className="elegant-card text-center py-12">
              <h3 className="font-script text-2xl mb-4 text-blush-500 dark:text-blush-400">
                No Categories Found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms to find the category you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoriesPage;
