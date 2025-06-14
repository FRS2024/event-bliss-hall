
import React from 'react';
import EnhancedVenueCard from './EnhancedVenueCard';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Venue } from '@/types';
import { useTranslation } from 'react-i18next';

interface EnhancedVenueGridProps {
  venues: Venue[];
  isLoading?: boolean;
  featured?: boolean;
}

const EnhancedVenueGrid: React.FC<EnhancedVenueGridProps> = ({ 
  venues, 
  isLoading = false, 
  featured = false 
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <EnhancedCard key={index} className="overflow-hidden">
            <div className="aspect-[4/3] skeleton"></div>
            <div className="p-6 space-y-4">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-6 w-1/4"></div>
                <div className="skeleton h-10 w-1/3"></div>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>
    );
  }
  
  if (venues.length === 0) {
    return (
      <EnhancedCard variant="elegant" className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
          <h3 className="heading-card text-gray-900 dark:text-white mb-4">
            No Venues Found
          </h3>
          <p className="text-body mb-8">
            Try adjusting your search filters or browse all venues to discover amazing spaces for your event.
          </p>
        </div>
      </EnhancedCard>
    );
  }

  // Determine grid layout based on featured status and item count
  const gridClass = featured 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8";

  return (
    <div className={gridClass}>
      {venues.map((venue, index) => (
        <EnhancedVenueCard 
          key={venue.id} 
          venue={venue} 
          featured={featured && index < 2}
        />
      ))}
    </div>
  );
};

export default EnhancedVenueGrid;
