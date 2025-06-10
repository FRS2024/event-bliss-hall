
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const VenuesList: React.FC = () => {
  const { data: venues, isLoading } = useQuery({
    queryKey: ['host-venues'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          venue_images (
            image_url,
            is_primary
          ),
          venue_features (
            feature_name
          )
        `)
        .eq('host_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading venues...</div>;
  }

  if (!venues || venues.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No venues yet</h3>
          <p className="text-gray-600 mb-4">Create your first venue to start accepting bookings</p>
          <Link to="/dashboard/add-venue">
            <Button>Add Your First Venue</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Venues</h2>
        <Link to="/dashboard/add-venue">
          <Button>Add New Venue</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => {
          const primaryImage = venue.venue_images?.find(img => img.is_primary)?.image_url;
          const features = venue.venue_features?.map(f => f.feature_name) || [];

          return (
            <Card key={venue.id} className="overflow-hidden">
              {primaryImage && (
                <div className="aspect-video relative">
                  <img
                    src={primaryImage}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    variant={venue.is_active ? "default" : "secondary"}
                    className="absolute top-2 right-2"
                  >
                    {venue.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="line-clamp-1">{venue.name}</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{venue.description}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {venue.city}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  Up to {venue.capacity} guests
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {venue.price_per_hour && `${venue.price_per_hour} DA/hr`}
                  {venue.price_per_day && ` • ${venue.price_per_day} DA/day`}
                  {venue.price_per_event && ` • ${venue.price_per_event} DA/event`}
                </div>
                
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{features.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Availability
                  </Button>
                  <Button size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VenuesList;
