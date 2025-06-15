
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Filter, Download, MoreHorizontal, UserCheck, UserX } from 'lucide-react';

const AllUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-all-users', searchTerm],
    queryFn: async () => {
      console.log('Fetching all users for admin...');

      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          business_name,
          phone,
          bio,
          avatar_url,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      // Get venue counts for each user to determine host status
      const userIds = data?.map(user => user.id) || [];
      const { data: venues } = await supabase
        .from('venues')
        .select('host_id')
        .in('host_id', userIds);

      // Get booking counts for each user
      const { data: guestBookings } = await supabase
        .from('bookings')
        .select('guest_id')
        .in('guest_id', userIds);

      const { data: hostBookings } = await supabase
        .from('bookings')
        .select('host_id')
        .in('host_id', userIds);

      // Enhance user data with stats
      const enhancedUsers = data?.map(user => {
        const venueCount = venues?.filter(v => v.host_id === user.id).length || 0;
        const guestBookingCount = guestBookings?.filter(b => b.guest_id === user.id).length || 0;
        const hostBookingCount = hostBookings?.filter(b => b.host_id === user.id).length || 0;

        return {
          ...user,
          isHost: venueCount > 0,
          venueCount,
          guestBookingCount,
          hostBookingCount,
          userType: venueCount > 0 ? 'Host' : 'Guest'
        };
      });

      return enhancedUsers || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-lg">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-600">
          Error loading users. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Users</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all platform users ({users?.length || 0} total)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or business..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {user.full_name?.charAt(0) || user.business_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.full_name || user.business_name || 'Unknown User'}
                        </p>
                        {user.business_name && user.full_name && (
                          <p className="text-sm text-gray-500">{user.business_name}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isHost ? "default" : "secondary"}>
                      {user.userType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{user.phone || 'No phone'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.isHost && (
                        <p>{user.venueCount} venues, {user.hostBookingCount} bookings</p>
                      )}
                      {!user.isHost && (
                        <p>{user.guestBookingCount} bookings</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found. {searchTerm && 'Try adjusting your search terms.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllUsers;
