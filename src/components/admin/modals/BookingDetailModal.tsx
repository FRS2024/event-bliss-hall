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
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  User,
  Building2,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface BookingDetailModalProps {
  bookingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BookingDetail {
  id: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  guest_count: number;
  total_price: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  venue: {
    id: string;
    name: string;
    address: string;
    city: string;
  } | null;
  guest: {
    id: string;
    full_name: string | null;
    phone: string | null;
    business_name: string | null;
  } | null;
  host: {
    id: string;
    full_name: string | null;
    phone: string | null;
    business_name: string | null;
  } | null;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  bookingId,
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [adminNotes, setAdminNotes] = React.useState('');
  const [newStatus, setNewStatus] = React.useState('');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['admin-booking-detail', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle();

      if (bookingError) throw bookingError;
      if (!bookingData) return null;

      // Fetch related data
      const [venueResult, guestResult, hostResult] = await Promise.all([
        supabase.from('venues').select('id, name, address, city').eq('id', bookingData.venue_id).maybeSingle(),
        supabase.from('profiles').select('id, full_name, phone, business_name').eq('id', bookingData.guest_id).maybeSingle(),
        supabase.from('profiles').select('id, full_name, phone, business_name').eq('id', bookingData.host_id).maybeSingle(),
      ]);

      return {
        ...bookingData,
        venue: venueResult.data,
        guest: guestResult.data,
        host: hostResult.data,
      } as BookingDetail;
    },
    enabled: !!bookingId && open,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId!);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-booking-detail', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: 'Status Updated',
        description: 'The booking status has been updated successfully.',
      });
      setNewStatus('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update booking status.',
        variant: 'destructive',
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (!bookingId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading booking data...</div>
          </div>
        ) : booking ? (
          <div className="space-y-6">
            {/* Booking Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-mono text-lg">{booking.id}</p>
              </div>
              <Badge variant={getStatusColor(booking.status)} className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            <Separator />

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(booking.event_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Guests</p>
                    <p className="text-sm text-muted-foreground">{booking.guest_count} people</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Total Price</p>
                    <p className="text-sm text-muted-foreground">{Number(booking.total_price).toLocaleString()} DA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Details */}
            {booking.venue && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Venue Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{booking.venue.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {booking.venue.address}, {booking.venue.city}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* People Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guest */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Guest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {booking.guest ? (
                    <div>
                      <p className="font-medium">{booking.guest.full_name || 'Unknown'}</p>
                      {booking.guest.phone && (
                        <p className="text-sm text-muted-foreground">{booking.guest.phone}</p>
                      )}
                      {booking.guest.business_name && (
                        <Badge variant="outline" className="mt-1">{booking.guest.business_name}</Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Guest information not available</p>
                  )}
                </CardContent>
              </Card>

              {/* Host */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Host
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {booking.host ? (
                    <div>
                      <p className="font-medium">{booking.host.full_name || 'Unknown'}</p>
                      {booking.host.phone && (
                        <p className="text-sm text-muted-foreground">{booking.host.phone}</p>
                      )}
                      {booking.host.business_name && (
                        <Badge variant="outline" className="mt-1">{booking.host.business_name}</Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Host information not available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Special Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{booking.special_requests}</p>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Admin Actions */}
            <div className="space-y-4">
              <h4 className="font-semibold">Admin Actions</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <div className="flex gap-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => updateStatusMutation.mutate({ status: newStatus })}
                      disabled={!newStatus || newStatus === booking.status || updateStatusMutation.isPending}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add internal notes about this booking..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Created: {formatDate(booking.created_at)}</span>
              <span>Last Updated: {formatDate(booking.updated_at)}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Booking not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailModal;
