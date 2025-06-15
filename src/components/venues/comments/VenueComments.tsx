import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, User, Flag, Edit, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, isAfter, addDays } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  booking_id: string;
  is_flagged: boolean;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  comment_replies?: Reply[];
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_flagged: boolean;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface BookingEligibility {
  canComment: boolean;
  hasExistingComment: boolean;
  unlockDate?: string;
  message: string;
}

interface VenueCommentsProps {
  venueId: string;
}

const VenueComments: React.FC<VenueCommentsProps> = ({ venueId }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check user's commenting eligibility
  const { data: eligibility } = useQuery({
    queryKey: ['comment-eligibility', venueId],
    queryFn: async (): Promise<BookingEligibility> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return {
          canComment: false,
          hasExistingComment: false,
          message: 'Please log in to comment.',
        };
      }

      // Get user's confirmed bookings for this venue
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, event_date, status')
        .eq('venue_id', venueId)
        .eq('guest_id', user.user.id)
        .eq('status', 'confirmed');

      if (bookingsError) throw bookingsError;

      if (!bookings || bookings.length === 0) {
        return {
          canComment: false,
          hasExistingComment: false,
          message: 'Only guests with confirmed bookings can comment.',
        };
      }

      // Check if user already has a comment for any booking
      const { data: existingComment } = await supabase
        .from('venue_comments')
        .select('id')
        .eq('venue_id', venueId)
        .eq('user_id', user.user.id)
        .maybeSingle();

      const hasExistingComment = !!existingComment;

      // Find the earliest eligible booking (24h after event date)
      const now = new Date();
      const eligibleBooking = bookings.find(booking => {
        const eventDate = new Date(booking.event_date);
        const unlockDate = addDays(eventDate, 1);
        return isAfter(now, unlockDate);
      });

      if (eligibleBooking) {
        return {
          canComment: !hasExistingComment,
          hasExistingComment,
          message: hasExistingComment 
            ? 'You have already commented on this venue.'
            : 'You can now comment on this venue.',
        };
      }

      // Find the next unlock date
      const nextUnlockBooking = bookings
        .map(booking => ({
          ...booking,
          unlockDate: addDays(new Date(booking.event_date), 1),
        }))
        .sort((a, b) => a.unlockDate.getTime() - b.unlockDate.getTime())[0];

      return {
        canComment: false,
        hasExistingComment,
        unlockDate: nextUnlockBooking?.unlockDate.toISOString(),
        message: `You'll be able to comment 24h after your event 🕒 (${format(nextUnlockBooking.unlockDate, 'PPP')})`,
      };
    },
  });

  // Fetch comments for the venue
  const { data: comments, isLoading } = useQuery({
    queryKey: ['venue-comments', venueId],
    queryFn: async (): Promise<Comment[]> => {
      const { data, error } = await supabase
        .from('venue_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          booking_id,
          is_flagged,
          profiles!venue_comments_user_id_fkey (
            full_name,
            avatar_url
          ),
          comment_replies (
            id,
            content,
            created_at,
            user_id,
            is_flagged,
            profiles!comment_replies_user_id_fkey (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('venue_id', venueId)
        .eq('is_flagged', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Submit comment mutation
  const submitCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Authentication required');

      // Get user's first confirmed booking for this venue
      const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('venue_id', venueId)
        .eq('guest_id', user.user.id)
        .eq('status', 'confirmed')
        .order('event_date', { ascending: true })
        .limit(1)
        .single();

      if (!booking) throw new Error('No confirmed booking found');

      const { data, error } = await supabase
        .from('venue_comments')
        .insert({
          venue_id: venueId,
          user_id: user.user.id,
          booking_id: booking.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Comment posted successfully!",
        description: "Your comment has been added.",
      });
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['venue-comments', venueId] });
      queryClient.invalidateQueries({ queryKey: ['comment-eligibility', venueId] });
    },
    onError: (error: any) => {
      console.error('Error posting comment:', error);
      toast({
        title: "Error posting comment",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Submit reply mutation
  const submitReplyMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('comment_replies')
        .insert({
          comment_id: commentId,
          user_id: user.user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Reply posted successfully!",
        description: "Your reply has been added.",
      });
      setReplyContent('');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['venue-comments', venueId] });
    },
    onError: (error: any) => {
      console.error('Error posting reply:', error);
      toast({
        title: "Error posting reply",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Please enter a comment",
        description: "Comment cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitCommentMutation.mutateAsync(newComment);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) {
      toast({
        title: "Please enter a reply",
        description: "Reply cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    await submitReplyMutation.mutateAsync({
      commentId,
      content: replyContent,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Comments
          </h3>

          {eligibility?.canComment ? (
            <div className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this venue..."
                rows={3}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {newComment.length}/1000 characters
                </div>
                <Button 
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-amber-600 mr-2" />
                <p className="text-amber-800">{eligibility?.message}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-6">
              {/* Main Comment */}
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    <User size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-sm">
                      {comment.profiles?.full_name || 'Anonymous User'}
                    </h4>
                    <span className="text-gray-500 text-xs">
                      {format(new Date(comment.created_at), 'PPp')}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-xs"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-red-600">
                      <Flag className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <div className="space-y-3">
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          maxLength={500}
                        />
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {replyContent.length}/500 characters
                          </div>
                          <div className="space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={!replyContent.trim()}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.comment_replies && comment.comment_replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                      {comment.comment_replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                              <User size={16} />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-xs">
                                {reply.profiles?.full_name || 'Anonymous User'}
                              </h5>
                              <span className="text-gray-500 text-xs">
                                {format(new Date(reply.created_at), 'PPp')}
                              </span>
                            </div>
                            <p className="text-gray-700 text-xs leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {comments?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No comments yet. Be the first to share your experience!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VenueComments;
