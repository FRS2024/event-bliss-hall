import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, CheckCircle, XCircle, Eye, MapPin, Users } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import TablePagination from '../shared/TablePagination';

interface PendingVenue {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  capacity: number;
  category: string;
  price_per_hour: number | null;
  price_per_day: number | null;
  price_per_event: number | null;
  created_at: string;
  host_id: string;
  host_profile: {
    full_name: string | null;
    business_name: string | null;
    avatar_url: string | null;
  };
  venue_images: Array<{ image_url: string; is_primary: boolean }>;
}

const VenuePendingApproval: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const { data: pendingVenues, isLoading, error } = useQuery({
    queryKey: ['admin-pending-venues'],
    queryFn: async () => {
      console.log('Fetching pending venues...');

      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*')
        .eq('is_active', false)
        .order('created_at', { ascending: false });

      if (venuesError) {
        console.error('Error fetching pending venues:', venuesError);
        throw venuesError;
      }

      // Get host profiles and venue images for each venue
      const venuesWithDetails = await Promise.all(
        venuesData.map(async (venue) => {
          const { data: hostProfile } = await supabase
            .from('profiles')
            .select('full_name, business_name, avatar_url')
            .eq('id', venue.host_id)
            .single();

          const { data: venueImages } = await supabase
            .from('venue_images')
            .select('image_url, is_primary')
            .eq('venue_id', venue.id);

          return {
            ...venue,
            host_profile: hostProfile || { full_name: null, business_name: null, avatar_url: null },
            venue_images: venueImages || []
          };
        })
      );

      return venuesWithDetails as PendingVenue[];
    },
    enabled: hasPermission(['super_admin', 'platform_manager']),
  });

  const pagination = usePagination({
    data: pendingVenues,
    itemsPerPage,
  });

  const approveMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { error } = await supabase
        .from('venues')
        .update({ is_active: true })
        .eq('id', venueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-venues'] });
      toast({
        title: "Venue Approved",
        description: "The venue has been successfully approved and is now live.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve venue. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-venues'] });
      toast({
        title: "Venue Rejected",
        description: "The venue has been rejected and removed from the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reject venue. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!hasPermission(['super_admin', 'platform_manager'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to manage venue approvals.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Venue Approvals</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading pending venues...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Venue Approvals</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading pending venues. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (hourly: number | null, daily: number | null, event: number | null) => {
    if (hourly) return `${hourly} DA/hour`;
    if (daily) return `${daily} DA/day`;
    if (event) return `${event} DA/event`;
    return 'Price not set';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPrimaryImage = (images: Array<{ image_url: string; is_primary: boolean }>) => {
    const primary = images.find(img => img.is_primary);
    return primary?.image_url || images[0]?.image_url || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Venue Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve venue listings before they go live
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Building2 className="h-3 w-3" />
            <span>{pendingVenues?.length || 0} Pending</span>
          </Badge>
        </div>
      </div>

      {pendingVenues?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Pending Venues
            </h3>
            <p className="text-gray-600">
              All venue submissions have been reviewed. Great job!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Venue Review Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedData?.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {getPrimaryImage(venue.venue_images) && (
                            <img
                              src={getPrimaryImage(venue.venue_images)}
                              alt={venue.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{venue.name}</div>
                          <Badge variant="outline">{venue.category}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={venue.host_profile?.avatar_url || ''} />
                          <AvatarFallback>
                            {venue.host_profile?.business_name?.[0] || venue.host_profile?.full_name?.[0] || 'H'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {venue.host_profile?.business_name || venue.host_profile?.full_name || 'Unknown Host'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{venue.city}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{venue.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatPrice(venue.price_per_hour, venue.price_per_day, venue.price_per_event)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(venue.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/venues/${venue.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveMutation.mutate(venue.id)}
                          disabled={approveMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectMutation.mutate(venue.id)}
                          disabled={rejectMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
              onPageChange={pagination.setCurrentPage}
              onFirstPage={pagination.goToFirstPage}
              onLastPage={pagination.goToLastPage}
              onNextPage={pagination.goToNextPage}
              onPreviousPage={pagination.goToPreviousPage}
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VenuePendingApproval;
