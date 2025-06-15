
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, Search, Calendar, Star } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface GuestProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  booking_count: number;
  last_booking: string | null;
}

const GuestUsers: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: guests, isLoading, error } = useQuery({
    queryKey: ['admin-guest-users', searchTerm],
    queryFn: async () => {
      console.log('Fetching guest users...');

      // First get profiles that are guests (no business_name)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${searchTerm}%`)
        .is('business_name', null)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching guest profiles:', profilesError);
        throw profilesError;
      }

      // Then get booking counts for each profile
      const guestProfiles = await Promise.all(
        profilesData.map(async (profile) => {
          const { count: bookingCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('guest_id', profile.id);

          const { data: lastBooking } = await supabase
            .from('bookings')
            .select('created_at')
            .eq('guest_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...profile,
            booking_count: bookingCount || 0,
            last_booking: lastBooking?.created_at || null
          };
        })
      );

      return guestProfiles as GuestProfile[];
    },
    enabled: hasPermission(['super_admin', 'platform_manager']),
  });

  if (!hasPermission(['super_admin', 'platform_manager'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view guest users.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Users</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading guest users...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Users</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading guest users. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUserInitials = (name: string | null) => {
    if (!name) return 'G';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeGuests = guests?.filter(g => g.booking_count > 0) || [];
  const newGuests = guests?.filter(g => {
    const guestDate = new Date(g.created_at);
    const now = new Date();
    return guestDate.getMonth() === now.getMonth() && 
           guestDate.getFullYear() === now.getFullYear();
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Users</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage event organizers and guests
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{guests?.length || 0} Total Guests</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Personal account holders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGuests.length}</div>
            <p className="text-xs text-muted-foreground">
              Have made bookings
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
              {guests?.reduce((sum, guest) => sum + guest.booking_count, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Made by guests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newGuests.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Guest Directory</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests..."
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
                <TableHead>Guest</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests?.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={guest.avatar_url || ''} />
                      <AvatarFallback>
                        {getUserInitials(guest.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {guest.full_name || 'Unnamed Guest'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {guest.id.slice(0, 8)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {guest.phone ? (
                      <Badge variant="outline">{guest.phone}</Badge>
                    ) : (
                      <span className="text-gray-400">No phone</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{guest.booking_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {guest.last_booking ? (
                      formatDate(guest.last_booking)
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(guest.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={guest.booking_count > 0 ? "default" : "secondary"}>
                      {guest.booking_count > 0 ? "Active" : "Inactive"}
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

export default GuestUsers;
