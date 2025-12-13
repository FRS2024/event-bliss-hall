import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flag, CheckCircle, XCircle, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FlaggedVenue {
  id: string;
  content_id: string;
  reason: string;
  description: string | null;
  status: string | null;
  created_at: string;
  admin_notes: string | null;
  resolution_type: string | null;
  venue?: {
    id: string;
    name: string;
    city: string;
    category: string;
    host_id: string;
  } | null;
}

const FlaggedVenues: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFlag, setSelectedFlag] = useState<FlaggedVenue | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const { data: flaggedVenues, isLoading } = useQuery({
    queryKey: ['flagged-venues'],
    queryFn: async () => {
      const { data: flags, error } = await supabase
        .from('flagged_content')
        .select('*')
        .eq('content_type', 'venue')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch venue details for each flag
      const venueIds = flags?.map(f => f.content_id) || [];
      const { data: venues } = await supabase
        .from('venues')
        .select('id, name, city, category, host_id')
        .in('id', venueIds);

      const venueMap = new Map(venues?.map(v => [v.id, v]) || []);

      return flags?.map(flag => ({
        ...flag,
        venue: venueMap.get(flag.content_id) || null
      })) as FlaggedVenue[];
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ flagId, resolution, notes }: { flagId: string; resolution: 'approved' | 'rejected'; notes: string }) => {
      const { error } = await supabase
        .from('flagged_content')
        .update({
          status: 'resolved',
          resolution_type: resolution,
          admin_notes: notes,
          resolved_at: new Date().toISOString()
        })
        .eq('id', flagId);

      if (error) throw error;

      // If rejected, deactivate the venue
      if (resolution === 'rejected' && selectedFlag?.content_id) {
        const { error: venueError } = await supabase
          .from('venues')
          .update({ is_active: false })
          .eq('id', selectedFlag.content_id);
        
        if (venueError) throw venueError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-venues'] });
      toast({
        title: 'Flag resolved',
        description: `The flagged venue has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`
      });
      setSelectedFlag(null);
      setAdminNotes('');
      setActionType(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to resolve flag. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleAction = (flag: FlaggedVenue, action: 'approve' | 'reject') => {
    setSelectedFlag(flag);
    setActionType(action);
    setAdminNotes('');
  };

  const confirmAction = () => {
    if (!selectedFlag || !actionType) return;
    resolveMutation.mutate({
      flagId: selectedFlag.id,
      resolution: actionType === 'approve' ? 'approved' : 'rejected',
      notes: adminNotes
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'reviewing':
        return <Badge className="bg-yellow-100 text-yellow-800">Reviewing</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
    }
  };

  const pendingFlags = flaggedVenues?.filter(f => f.status === 'pending') || [];
  const resolvedFlags = flaggedVenues?.filter(f => f.status === 'resolved') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Flagged Venues</h1>
        <p className="text-muted-foreground">Review venues that have been reported or flagged</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingFlags.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedFlags.length}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Flag className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{flaggedVenues?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Flags</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Pending Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingFlags.length === 0 ? (
            <div className="text-center py-8">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Pending Flags</h3>
              <p className="text-muted-foreground">All flagged venues have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingFlags.map((flag) => (
                <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{flag.venue?.name || 'Unknown Venue'}</h4>
                      {getStatusBadge(flag.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {flag.venue?.city} • {flag.venue?.category}
                    </p>
                    <p className="text-sm"><strong>Reason:</strong> {flag.reason}</p>
                    {flag.description && (
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Flagged on {format(new Date(flag.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(flag, 'approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleAction(flag, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolved Flags */}
      {resolvedFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Resolved Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resolvedFlags.slice(0, 5).map((flag) => (
                <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{flag.venue?.name || 'Unknown Venue'}</h4>
                      <Badge className={flag.resolution_type === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {flag.resolution_type === 'approved' ? 'Approved' : 'Rejected'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{flag.reason}</p>
                    {flag.admin_notes && (
                      <p className="text-sm"><strong>Notes:</strong> {flag.admin_notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog */}
      <Dialog open={!!selectedFlag && !!actionType} onOpenChange={() => { setSelectedFlag(null); setActionType(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Venue' : 'Reject Venue'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Venue:</strong> {selectedFlag?.venue?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Flag Reason:</strong> {selectedFlag?.reason}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Admin Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about your decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedFlag(null); setActionType(null); }}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={confirmAction}
              disabled={resolveMutation.isPending}
            >
              {resolveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlaggedVenues;
