
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Building2, Search, Users, MapPin, Calendar } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface HostProfile {
  id: string;
  full_name: string | null;
  business_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  venue_count: number;
  total_bookings: number;
  is_verified: boolean;
}

const HostUsers: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: hosts, isLoading, error } = useQuery({
    queryKey: ['admin-host-users', searchTerm],
    queryFn: async () => {
      console.log('Fetching host users...');

      // First get profiles that are hosts (have business_name)  
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('business_name', `%${searchTerm}%`)
        .not('business_name', 'is', null)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching host profiles:', profilesError);
        throw profilesError;
      }

      // Then get venue and booking counts for each profile
      const hostProfiles = await Promise.all(
        profilesData.map(async (profile) => {
          const { count: venueCount } = await supabase
            .from('venues')
            .select('*', { count: 'exact', head: true })
            .eq('host_id', profile.id);

          const { count: bookingCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('host_id', profile.id);

          return {
            ...profile,
            venue_count: venueCount || 0,
            total_bookings: bookingCount || 0,
            is_verified: !!profile.business_name
          };
        })
      );

      return hostProfiles as HostProfile[];
    },
    enabled: hasPermission(['super_admin', 'platform_manager']),
  });

  if (!hasPermission(['super_admin', 'platform_manager'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view host users.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Host Users</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading host users...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Host Users</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading host users. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUserInitials = (name: string | null, businessName: string | null) => {
    const displayName = businessName || name;
    if (!displayName) return 'H';
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase();
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Host Users</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage venue owners and hosts on the platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Building2 className="h-3 w-3" />
            <span>{hosts?.length || 0} Active Hosts</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hosts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Business account holders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hosts?.reduce((sum, host) => sum + host.venue_count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Listed venues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hosts?.reduce((sum, host) => sum + host.total_bookings, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Hosts</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hosts?.filter(h => h.is_verified)?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Business verified
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Host Directory</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hosts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Host</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Venues</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts?.map((host) => (
                <TableRow key={host.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={host.avatar_url || ''} />
                      <AvatarFallback>
                        {getUserInitials(host.full_name, host.business_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {host.full_name || 'Unnamed Host'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {host.phone || 'No phone'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{host.business_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span>{host.venue_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{host.total_bookings}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(host.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={host.is_verified ? "default" : "secondary"}>
                      {host.is_verified ? "Verified" : "Pending"}
                    </Badge>
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

export default HostUsers;
