import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { getVenueById } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star } from 'lucide-react';
import BookingCalendarSection from '@/components/booking/BookingCalendarSection';
import VenueImageGallery from '@/components/venues/VenueImageGallery';

const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => getVenueById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-[480px] bg-muted rounded-xl mb-6"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !venue) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Venue Not Found</h2>
              <p className="text-muted-foreground">The venue you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery - Full Width */}
        <div className="mb-8 group">
          <VenueImageGallery 
            images={venue.images} 
            venueName={venue.name}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Venue Details */}
            <Card>
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{venue.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">Up to {venue.capacity} guests</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-champagne-500 fill-champagne-500" />
                    <span className="text-muted-foreground">{venue.rating} ({venue.reviewCount} reviews)</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{venue.description}</p>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {venue.price} DA
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {venue.price_per_day ? 'per day' : 
                     venue.price_per_event ? 'per event' : 'per hour'}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="text-foreground">{venue.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span className="text-foreground">{venue.capacity} guests</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Calendar */}
            <BookingCalendarSection venue={venue} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VenueDetailPage;
