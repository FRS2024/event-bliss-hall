import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, MessageSquare, Star, Image, Flag, 
  CheckCircle, XCircle, Eye, Loader2 
} from 'lucide-react';
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

interface FlaggedItem {
  id: string;
  content_id: string;
  content_type: string;
  reason: string;
  description: string | null;
  status: string | null;
  created_at: string;
  admin_notes: string | null;
  resolution_type: string | null;
}

interface Review {
  id: string;
  venue_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  venue?: { name: string } | null;
  profile?: { full_name: string } | null;
}

interface Comment {
  id: string;
  venue_id: string;
  user_id: string;
  content: string;
  is_flagged: boolean | null;
  created_at: string;
  venue?: { name: string } | null;
  profile?: { full_name: string } | null;
}

const AdminModeration: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<FlaggedItem | Review | Comment | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch all flagged content
  const { data: flaggedContent, isLoading: loadingFlags } = useQuery({
    queryKey: ['all-flagged-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flagged_content')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as FlaggedItem[];
    }
  });

  // Fetch flagged reviews
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['flagged-reviews'],
    queryFn: async () => {
      const { data: flaggedReviewIds } = await supabase
        .from('flagged_content')
        .select('content_id')
        .eq('content_type', 'review')
        .eq('status', 'pending');

      if (!flaggedReviewIds?.length) return [];

      const { data, error } = await supabase
        .from('venue_reviews')
        .select('*, venue:venues(name)')
        .in('id', flaggedReviewIds.map(f => f.content_id));

      if (error) throw error;
      return data as Review[];
    }
  });

  // Fetch flagged comments
  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['flagged-comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venue_comments')
        .select('*, venue:venues(name)')
        .eq('is_flagged', true);

      if (error) throw error;
      return data as Comment[];
    }
  });

  // Resolve flagged content mutation
  const resolveMutation = useMutation({
    mutationFn: async ({ id, resolution, notes, contentType }: { 
      id: string; 
      resolution: 'approved' | 'rejected'; 
      notes: string;
      contentType?: string;
    }) => {
      // Update flagged_content if it's a flag
      if (contentType === 'flag') {
        const { error } = await supabase
          .from('flagged_content')
          .update({
            status: 'resolved',
            resolution_type: resolution,
            admin_notes: notes,
            resolved_at: new Date().toISOString()
          })
          .eq('id', id);
        if (error) throw error;
      } else if (contentType === 'comment') {
        // Unflag the comment
        const { error } = await supabase
          .from('venue_comments')
          .update({ is_flagged: false })
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-flagged-content'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-comments'] });
      toast({ title: 'Content moderated successfully' });
      setSelectedItem(null);
      setActionType(null);
      setAdminNotes('');
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to moderate content', variant: 'destructive' });
    }
  });

  // Delete content mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'review' | 'comment' }) => {
      if (type === 'review') {
        const { error } = await supabase.from('venue_reviews').delete().eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('venue_comments').delete().eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['flagged-comments'] });
      toast({ title: 'Content deleted' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete content', variant: 'destructive' });
    }
  });

  const pendingFlags = flaggedContent?.filter(f => f.status === 'pending') || [];
  const resolvedFlags = flaggedContent?.filter(f => f.status === 'resolved') || [];

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'venue': return <Flag className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loadingFlags) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Content Moderation</h1>
        <p className="text-muted-foreground">Moderate content and handle reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingFlags.length}</p>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reviews?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Flagged Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{comments?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Flagged Comments</p>
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Reports ({pendingFlags.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reviews ({reviews?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({comments?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingFlags.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">All Clear!</h3>
                  <p className="text-muted-foreground">No pending reports to review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingFlags.map((flag) => (
                    <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getContentTypeIcon(flag.content_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{flag.content_type}</span>
                            <Badge variant="outline">{flag.reason}</Badge>
                          </div>
                          {flag.description && (
                            <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Reported on {format(new Date(flag.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(flag);
                            setActionType('approve');
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(flag);
                            setActionType('reject');
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Take Action
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingReviews ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : reviews?.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Flagged Reviews</h3>
                  <p className="text-muted-foreground">All reviews are in good standing.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews?.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.venue?.name || 'Unknown Venue'}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment || 'No comment'}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(review.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate({ id: review.id, type: 'review' })}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : comments?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Flagged Comments</h3>
                  <p className="text-muted-foreground">All comments are in good standing.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{comment.venue?.name || 'Unknown Venue'}</span>
                          <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(comment.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveMutation.mutate({ 
                              id: comment.id, 
                              resolution: 'approved', 
                              notes: '', 
                              contentType: 'comment' 
                            })}
                          >
                            Unflag
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMutation.mutate({ id: comment.id, type: 'comment' })}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={!!selectedItem && !!actionType} onOpenChange={() => { setSelectedItem(null); setActionType(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Dismiss Report' : 'Take Action'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {actionType === 'approve' 
                ? 'This will dismiss the report as no action needed.'
                : 'This will mark the content as a violation and may result in removal.'}
            </p>
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
            <Button variant="outline" onClick={() => { setSelectedItem(null); setActionType(null); }}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={() => {
                if (selectedItem && 'content_type' in selectedItem) {
                  resolveMutation.mutate({
                    id: selectedItem.id,
                    resolution: actionType === 'approve' ? 'approved' : 'rejected',
                    notes: adminNotes,
                    contentType: 'flag'
                  });
                }
              }}
              disabled={resolveMutation.isPending}
            >
              {resolveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminModeration;
