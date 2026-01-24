import React from 'react';
import { useTranslation } from 'react-i18next';
import VenueCard from './VenueCard';
import { Venue } from '@/types';
import EmptyState from '@/components/ui/EmptyState';

interface VenueGridProps {
  venues: Venue[];
  isLoading?: boolean;
  onClearFilters?: () => void;
}

const VenueGrid: React.FC<VenueGridProps> = ({ venues, isLoading = false, onClearFilters }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="venue-card overflow-hidden"
          >
            {/* Image skeleton with shimmer */}
            <div className="relative h-60 w-full rounded-t-lg overflow-hidden">
              <div className="absolute inset-0 animate-shimmer" />
            </div>
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="h-6 bg-muted rounded w-3/4 animate-shimmer" />
                <div className="h-5 bg-muted rounded w-12 animate-shimmer" />
              </div>
              <div className="h-4 bg-muted rounded w-1/2 animate-shimmer" />
              <div className="h-4 bg-muted rounded w-2/3 animate-shimmer" />
              {/* Price block skeleton */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="h-6 bg-muted rounded w-1/2 animate-shimmer" />
                <div className="h-5 bg-muted rounded w-24 animate-shimmer" />
              </div>
              {/* Button skeletons */}
              <div className="space-y-2">
                <div className="h-11 bg-muted rounded animate-shimmer" />
                <div className="h-11 bg-muted rounded animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (venues.length === 0) {
    return (
      <EmptyState
        type="no-results"
        title={t('venues.noResults', 'No venues match your search')}
        description={t('venues.tryAdjusting', 'Try adjusting your filters to find what you\'re looking for.')}
        primaryAction={onClearFilters ? {
          label: t('filters.clearAll', 'Clear All Filters'),
          onClick: onClearFilters
        } : undefined}
        secondaryAction={{
          label: t('home.viewAllVenues', 'View All Venues'),
          onClick: () => window.location.href = '/venues'
        }}
      />
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
