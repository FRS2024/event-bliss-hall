import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, UserCheck, Ban, MoreHorizontal, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { usePagination } from '@/hooks/usePagination';
import TablePagination from '../shared/TablePagination';
import UserProfileModal from '../modals/UserProfileModal';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  business_name: string | null;
  phone: string | null;
  created_at: string;
  is_suspended: boolean | null;
}

const AllUsers: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-all-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: hasPermission(['super_admin', 'platform_manager']),
  });

  const pagination = usePagination({
    data: users,
    itemsPerPage,
  });

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setProfileModalOpen(true);
  };

  if (!hasPermission(['super_admin', 'platform_manager'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view users.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">All Users</h1>
        <Card><CardContent className="p-6 text-center">Loading users...</CardContent></Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">All Users</h1>
        <Card><CardContent className="p-6 text-center text-red-600">Error loading users.</CardContent></Card>
      </div>
    );
  }

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Users</h1>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
        <Badge variant="outline"><Users className="h-3 w-3 mr-1" />{users?.length || 0} Total</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.filter(u => u.business_name)?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.filter(u => u.is_suspended)?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Directory</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedData?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>{getUserInitials(user.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                      <div className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.business_name ? <Badge variant="secondary">{user.business_name}</Badge> : <span className="text-muted-foreground">Personal</span>}
                  </TableCell>
                  <TableCell>{user.phone || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                  <TableCell>
                    {user.is_suspended ? (
                      <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" />Suspended</Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Activity</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      <UserProfileModal userId={selectedUserId} open={profileModalOpen} onOpenChange={setProfileModalOpen} />
    </div>
  );
};

export default AllUsers;
