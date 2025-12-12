import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  MapPin,
  Ban,
  CheckCircle,
  Activity,
  MessageSquare,
} from 'lucide-react';

interface UserProfileModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  business_name: string | null;
  phone: string | null;
  bio: string | null;
  user_role: string | null;
  created_at: string;
  is_suspended: boolean | null;
  suspended_at: string | null;
  suspended_reason: string | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [suspendReason, setSuspendReason] = React.useState('');
  const [showSuspendForm, setShowSuspendForm] = React.useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['admin-user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!userId && open,
  });

  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const [venuesResult, bookingsAsGuestResult, bookingsAsHostResult] = await Promise.all([
        supabase.from('venues').select('id').eq('host_id', userId),
        supabase.from('bookings').select('id, total_price').eq('guest_id', userId),
        supabase.from('bookings').select('id, total_price').eq('host_id', userId),
      ]);

      return {
        venuesCount: venuesResult.data?.length || 0,
        bookingsAsGuest: bookingsAsGuestResult.data?.length || 0,
        bookingsAsHost: bookingsAsHostResult.data?.length || 0,
        revenueAsHost: bookingsAsHostResult.data?.reduce((sum, b) => sum + Number(b.total_price || 0), 0) || 0,
        spentAsGuest: bookingsAsGuestResult.data?.reduce((sum, b) => sum + Number(b.total_price || 0), 0) || 0,
      };
    },
    enabled: !!userId && open,
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ suspend, reason }: { suspend: boolean; reason?: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_suspended: suspend,
          suspended_at: suspend ? new Date().toISOString() : null,
          suspended_reason: suspend ? reason : null,
        })
        .eq('id', userId!);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-user-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
      toast({
        title: variables.suspend ? 'User Suspended' : 'User Unsuspended',
        description: variables.suspend 
          ? 'The user has been suspended from the platform.'
          : 'The user account has been reactivated.',
      });
      setShowSuspendForm(false);
      setSuspendReason('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
      });
    },
  });

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading user data...</div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar_url || ''} />
                <AvatarFallback className="text-lg">
                  {getUserInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{user.full_name || 'Unnamed User'}</h3>
                  {user.is_suspended && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <Ban className="h-3 w-3" />
                      Suspended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                {user.user_role && (
                  <Badge variant="secondary" className="mt-1">
                    {user.user_role}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* User Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone || 'No phone provided'}</span>
              </div>
              {user.business_name && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{user.business_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
            </div>

            {user.bio && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{user.bio}</p>
              </div>
            )}

            {/* User Statistics */}
            {userStats && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Activity Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold">{userStats.venuesCount}</div>
                        <div className="text-xs text-muted-foreground">Venues Owned</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold">{userStats.bookingsAsGuest}</div>
                        <div className="text-xs text-muted-foreground">Bookings Made</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold">{userStats.bookingsAsHost}</div>
                        <div className="text-xs text-muted-foreground">Bookings Received</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold">{userStats.revenueAsHost.toLocaleString()} DA</div>
                        <div className="text-xs text-muted-foreground">Revenue Earned</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {/* Suspension Info */}
            {user.is_suspended && user.suspended_at && (
              <>
                <Separator />
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <h4 className="font-semibold text-destructive mb-2">Suspension Details</h4>
                  <p className="text-sm">
                    <strong>Suspended on:</strong> {formatDate(user.suspended_at)}
                  </p>
                  {user.suspended_reason && (
                    <p className="text-sm mt-1">
                      <strong>Reason:</strong> {user.suspended_reason}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Suspend Form */}
            {showSuspendForm && !user.is_suspended && (
              <div className="p-4 border rounded-lg space-y-3">
                <Label>Suspension Reason</Label>
                <Textarea
                  placeholder="Enter the reason for suspending this user..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => suspendMutation.mutate({ suspend: true, reason: suspendReason })}
                    disabled={!suspendReason.trim() || suspendMutation.isPending}
                  >
                    Confirm Suspension
                  </Button>
                  <Button variant="outline" onClick={() => setShowSuspendForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
              <div className="flex gap-2">
                {user.is_suspended ? (
                  <Button
                    variant="default"
                    onClick={() => suspendMutation.mutate({ suspend: false })}
                    disabled={suspendMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unsuspend User
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => setShowSuspendForm(true)}
                    disabled={showSuspendForm}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend User
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            User not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
