
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Search, Eye, MapPin, Users, Star } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface ActiveVenue {
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
  host_profile: {
    full_name: string | null;
    business_name: string | null;
  };
  booking_count: number;
}

const ActiveVenues: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');

  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['admin-active-venues', searchTerm, categoryFilter],
    queryFn: async () => {
      console.log('Fetching active venues...');

      let venuesQuery = supabase
        .from('venues')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        venuesQuery = venuesQuery.ilike('name', `%${searchTerm}%`);
      }

      if (categoryFilter !== 'all') {
        venuesQuery = venuesQuery.eq('category', categoryFilter);
      }

      const { data: venuesData, error: venuesError } = await venuesQuery;

      if (venuesError) {
        console.error('Error fetching active venues:', venuesError);
        throw venuesError;
      }

      // Get host profiles and booking counts for each venue
      const venuesWithDetails = await Promise.all(
        venuesData.map(async (venue) => {
          const { data: hostProfile } = await supabase
            .from('profiles')
            .select('full_name, business_name')
            .eq('id', venue.host_id)
            .single();

          const { count: bookingCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('venue_id', venue.id);

          return {
            ...venue,
            host_profile: hostProfile || { full_name: null, business_name: null },
            booking_count: bookingCount || 0
          };
        })
      );

      return venuesWithDetails as ActiveVenue[];
    },
    enabled: hasPermission(['super_admin', 'platform_manager']),
  });

  const categories = [
    'Wedding Hall', 'Conference Room', 'Event Space', 'Restaurant', 
    'Hotel', 'Outdoor Venue', 'Corporate Space', 'Cultural Center'
  ];

  if (!hasPermission(['super_admin', 'platform_manager'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view active venues.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Venues</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading active venues...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Venues</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading active venues. Please try again.</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Venues</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all live venue listings on the platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Building2 className="h-3 w-3" />
            <span>{venues?.length || 0} Active</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Venues</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venues?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Live on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {venues?.reduce((sum, venue) => sum + venue.booking_count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...(venues?.map(v => v.booking_count) || [0]))}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(venues?.map(v => v.category)).size || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique categories
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Venue Directory</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
                <TableHead>Bookings</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues?.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{venue.name}</div>
                      <Badge variant="outline">{venue.category}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {venue.host_profile?.business_name || venue.host_profile?.full_name || 'Unknown Host'}
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
                  <TableCell>
                    <Badge variant={venue.booking_count > 0 ? "default" : "secondary"}>
                      {venue.booking_count}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(venue.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/venues/${venue.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveVenues;
