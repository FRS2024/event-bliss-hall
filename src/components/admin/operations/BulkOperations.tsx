import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Users, Building, Calendar, Trash2, CheckCircle, XCircle, Mail } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const BulkOperations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ type: string; action: string } | null>(null);

  const { data: users } = useQuery({
    queryKey: ['bulk-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, user_role, is_suspended, is_verified')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const { data: venues } = useQuery({
    queryKey: ['bulk-venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name, city, is_active, category')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ['bulk-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, event_date, status, total_price, venues(name)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const bulkUserAction = useMutation({
    mutationFn: async ({ action }: { action: 'suspend' | 'unsuspend' | 'verify' }) => {
      const updates = action === 'suspend' 
        ? { is_suspended: true, suspended_at: new Date().toISOString(), suspended_by: user?.id }
        : action === 'unsuspend'
        ? { is_suspended: false, suspended_at: null, suspended_by: null }
        : { is_verified: true, verified_at: new Date().toISOString(), verified_by: user?.id };
      
      for (const userId of selectedUsers) {
        await supabase.from('profiles').update(updates).eq('id', userId);
        await supabase.from('admin_activity_log').insert({
          admin_id: user?.id,
          action: `bulk_${action}`,
          resource_type: 'user',
          resource_id: userId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-users'] });
      toast.success(`${selectedUsers.length} users updated`);
      setSelectedUsers([]);
      setConfirmDialog(null);
    },
    onError: () => toast.error('Bulk action failed'),
  });

  const bulkVenueAction = useMutation({
    mutationFn: async ({ action }: { action: 'activate' | 'deactivate' }) => {
      for (const venueId of selectedVenues) {
        await supabase.from('venues').update({ is_active: action === 'activate' }).eq('id', venueId);
        await supabase.from('admin_activity_log').insert({
          admin_id: user?.id,
          action: `bulk_venue_${action}`,
          resource_type: 'venue',
          resource_id: venueId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-venues'] });
      toast.success(`${selectedVenues.length} venues updated`);
      setSelectedVenues([]);
      setConfirmDialog(null);
    },
    onError: () => toast.error('Bulk action failed'),
  });

  const bulkBookingAction = useMutation({
    mutationFn: async ({ action }: { action: 'confirm' | 'cancel' }) => {
      for (const bookingId of selectedBookings) {
        await supabase.from('bookings').update({ status: action === 'confirm' ? 'confirmed' : 'cancelled' }).eq('id', bookingId);
        await supabase.from('admin_activity_log').insert({
          admin_id: user?.id,
          action: `bulk_booking_${action}`,
          resource_type: 'booking',
          resource_id: bookingId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-bookings'] });
      toast.success(`${selectedBookings.length} bookings updated`);
      setSelectedBookings([]);
      setConfirmDialog(null);
    },
    onError: () => toast.error('Bulk action failed'),
  });

  const toggleSelection = (id: string, list: string[], setList: (ids: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter(x => x !== id));
    } else {
      setList([...list, id]);
    }
  };

  const selectAll = (items: { id: string }[] | undefined, setList: (ids: string[]) => void) => {
    if (!items) return;
    setList(items.map(i => i.id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Bulk Operations</h2>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="venues" className="flex items-center gap-2">
            <Building className="h-4 w-4" /> Venues
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Select Users ({selectedUsers.length} selected)</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => selectAll(users, setSelectedUsers)}>
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedUsers([])}>
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {users?.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-2 border rounded">
                    <Checkbox 
                      checked={selectedUsers.includes(u.id)}
                      onCheckedChange={() => toggleSelection(u.id, selectedUsers, setSelectedUsers)}
                    />
                    <span className="flex-1">{u.full_name || 'Unknown'}</span>
                    <Badge variant="outline">{u.user_role}</Badge>
                    {u.is_suspended && <Badge variant="destructive">Suspended</Badge>}
                    {u.is_verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                  </div>
                ))}
              </div>
              {selectedUsers.length > 0 && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    onClick={() => setConfirmDialog({ type: 'users', action: 'suspend' })}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Suspend Selected
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setConfirmDialog({ type: 'users', action: 'unsuspend' })}
                  >
                    Unsuspend Selected
                  </Button>
                  <Button onClick={() => setConfirmDialog({ type: 'users', action: 'verify' })}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Verify Selected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venues">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Select Venues ({selectedVenues.length} selected)</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => selectAll(venues, setSelectedVenues)}>
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedVenues([])}>
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {venues?.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-2 border rounded">
                    <Checkbox 
                      checked={selectedVenues.includes(v.id)}
                      onCheckedChange={() => toggleSelection(v.id, selectedVenues, setSelectedVenues)}
                    />
                    <span className="flex-1">{v.name}</span>
                    <span className="text-sm text-muted-foreground">{v.city}</span>
                    <Badge variant={v.is_active ? 'default' : 'secondary'}>
                      {v.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
              {selectedVenues.length > 0 && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => setConfirmDialog({ type: 'venues', action: 'activate' })}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Activate Selected
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => setConfirmDialog({ type: 'venues', action: 'deactivate' })}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Deactivate Selected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Select Bookings ({selectedBookings.length} selected)</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => selectAll(bookings, setSelectedBookings)}>
                  Select All
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedBookings([])}>
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {bookings?.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-2 border rounded">
                    <Checkbox 
                      checked={selectedBookings.includes(b.id)}
                      onCheckedChange={() => toggleSelection(b.id, selectedBookings, setSelectedBookings)}
                    />
                    <span className="flex-1">{(b.venues as any)?.name || 'Unknown Venue'}</span>
                    <span className="text-sm">{b.event_date}</span>
                    <Badge variant={
                      b.status === 'confirmed' ? 'default' : 
                      b.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
              {selectedBookings.length > 0 && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => setConfirmDialog({ type: 'bookings', action: 'confirm' })}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Confirm Selected
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => setConfirmDialog({ type: 'bookings', action: 'cancel' })}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Cancel Selected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmDialog?.action} {
                confirmDialog?.type === 'users' ? selectedUsers.length :
                confirmDialog?.type === 'venues' ? selectedVenues.length :
                selectedBookings.length
              } {confirmDialog?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (confirmDialog?.type === 'users') {
                bulkUserAction.mutate({ action: confirmDialog.action as any });
              } else if (confirmDialog?.type === 'venues') {
                bulkVenueAction.mutate({ action: confirmDialog.action as any });
              } else if (confirmDialog?.type === 'bookings') {
                bulkBookingAction.mutate({ action: confirmDialog.action as any });
              }
            }}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
