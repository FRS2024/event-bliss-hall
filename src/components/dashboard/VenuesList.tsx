
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const VenuesList: React.FC = () => {
  const queryClient = useQueryClient();

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

  const deleteVenueMutation = useMutation({
    mutationFn: async (venueId: string) => {
      // First delete venue images from storage
      const { data: images } = await supabase
        .from('venue_images')
        .select('image_url')
        .eq('venue_id', venueId);

      if (images) {
        for (const image of images) {
          const path = image.image_url.split('/').pop();
          if (path) {
            await supabase.storage
              .from('venue-images')
              .remove([path]);
          }
        }
      }

      // Delete venue (cascade will handle related records)
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-venues'] });
      toast.success('Venue deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting venue:', error);
      toast.error('Failed to delete venue');
    }
  });

  const toggleVenueStatusMutation = useMutation({
    mutationFn: async ({ venueId, isActive }: { venueId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('venues')
        .update({ is_active: !isActive, updated_at: new Date().toISOString() })
        .eq('id', venueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-venues'] });
      toast.success('Venue status updated');
    },
    onError: (error) => {
      console.error('Error updating venue status:', error);
      toast.error('Failed to update venue status');
    }
  });

  const handleDeleteVenue = (venueId: string) => {
    if (window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      deleteVenueMutation.mutate(venueId);
    }
  };

  const handleToggleStatus = (venueId: string, isActive: boolean) => {
    toggleVenueStatusMutation.mutate({ venueId, isActive });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading venues...</div>
      </div>
    );
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
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleToggleStatus(venue.id, venue.is_active || false)}
                      disabled={toggleVenueStatusMutation.isPending}
                      title={venue.is_active ? 'Deactivate venue' : 'Activate venue'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteVenue(venue.id)}
                      disabled={deleteVenueMutation.isPending}
                      title="Delete venue"
                    >
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
                  <div className="flex flex-wrap gap-1">
                    {venue.price_per_hour && <span>{venue.price_per_hour} DA/hr</span>}
                    {venue.price_per_day && <span>{venue.price_per_day} DA/day</span>}
                    {venue.price_per_event && <span>{venue.price_per_event} DA/event</span>}
                  </div>
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
