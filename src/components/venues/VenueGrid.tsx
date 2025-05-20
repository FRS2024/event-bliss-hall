
import React from 'react';
import VenueCard from './VenueCard';
import { Venue } from '@/types';

interface VenueGridProps {
  venues: Venue[];
  isLoading?: boolean;
}

const VenueGrid: React.FC<VenueGridProps> = ({ venues, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="venue-card animate-pulse"
          >
            <div className="bg-gray-200 dark:bg-gray-700 h-60 w-full rounded-t-lg" />
            <div className="p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (venues.length === 0) {
    return (
      <div className="elegant-card text-center py-12">
        <h3 className="font-script text-2xl mb-4 text-blush-500 dark:text-blush-400">No Venues Found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search filters or browse all venues.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};

export default VenueGrid;
