
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  MessageCircle, 
  Flag, 
  Eye, 
  EyeOff, 
  Trash2, 
  User,
  AlertTriangle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface FlaggedReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  venue_id: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  venues?: {
    name: string;
  } | null;
}

interface FlaggedComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  venue_id: string;
  booking_id: string;
  is_flagged: boolean;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  venues?: {
    name: string;
  } | null;
}

interface FlaggedReply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  comment_id: string;
  is_flagged: boolean;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  venue_comments?: {
    venues?: {
      name: string;
    } | null;
  } | null;
}

const AdminModeration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flagge d-reviews');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch flagged reviews
  const { data: flaggedReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['admin-flagged-reviews'],
    queryFn: async (): Promise<FlaggedReview[]> => {
      const { data, error } = await supabase
        .from('venue_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id,
          venue_id,
          profiles!venue_reviews_user_id_fkey (
            full_name,
            avatar_url
          ),
          venues!venue_reviews_venue_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch flagged comments
  const { data: flaggedComments, isLoading: commentsLoading } = useQuery({
    queryKey: ['admin-flagged-comments'],
    queryFn: async (): Promise<FlaggedComment[]> => {
      const { data, error } = await supabase
        .from('venue_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          venue_id,
          booking_id,
          is_flagged,
          profiles!venue_comments_user_id_fkey (
            full_name,
            avatar_url
          ),
          venues!venue_comments_venue_id_fkey (
            name
          )
        `)
        .eq('is_flagged', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch flagged replies
  const { data: flaggedReplies, isLoading: repliesLoading } = useQuery({
    queryKey: ['admin-flagged-replies'],
    queryFn: async (): Promise<FlaggedReply[]> => {
      const { data, error } = await supabase
        .from('comment_replies')
        .select(`
          id,
          content,
          created_at,
          user_id,
          comment_id,
          is_flagged,
          profiles!comment_replies_user_id_fkey (
            full_name,
            avatar_url
          ),
          venue_comments!comment_replies_comment_id_fkey (
            venues!venue_comments_venue_id_fkey (
              name
            )
          )
        `)
        .eq('is_flagged', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('venue_reviews')
        .delete()
        .eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Review deleted successfully",
        description: "The review has been removed from the platform.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-flagged-reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle comment flag mutation
  const toggleCommentFlagMutation = useMutation({
    mutationFn: async ({ id, isFlagged }: { id: string; isFlagged: boolean }) => {
      const { error } = await supabase
        .from('venue_comments')
        .update({ is_flagged: isFlagged })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { isFlagged }) => {
      toast({
        title: isFlagged ? "Comment flagged" : "Comment unflagged",
        description: isFlagged ? "Comment has been hidden from public view." : "Comment is now visible to users.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-flagged-comments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('venue_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Comment deleted successfully",
        description: "The comment has been removed from the platform.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-flagged-comments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
        <p className="text-gray-600 dark:text-gray-400">Moderate reviews, comments, and replies</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flagged-reviews" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="flagged-comments" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Comments</span>
            {flaggedComments && flaggedComments.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {flaggedComments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="flagged-replies" className="flex items-center space-x-2">
            <Flag className="h-4 w-4" />
            <span>Replies</span>
            {flaggedReplies && flaggedReplies.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {flaggedReplies.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flagged-reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : flaggedReviews && flaggedReviews.length > 0 ? (
                <div className="space-y-4">
                  {flaggedReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.profiles?.avatar_url || undefined} />
                              <AvatarFallback>
                                <User size={20} />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sm">
                                  {review.profiles?.full_name || 'Anonymous User'}
                                </h4>
                                <span className="text-gray-500 text-xs">
                                  {format(new Date(review.created_at), 'PPp')}
                                </span>
                              </div>
                              <div className="mb-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Venue: {review.venues?.name}
                              </p>
                              {review.comment && (
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteReviewMutation.mutate(review.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No reviews to moderate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged-comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Flagged Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : flaggedComments && flaggedComments.length > 0 ? (
                <div className="space-y-4">
                  {flaggedComments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                              <AvatarFallback>
                                <User size={20} />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sm">
                                  {comment.profiles?.full_name || 'Anonymous User'}
                                </h4>
                                <span className="text-gray-500 text-xs">
                                  {format(new Date(comment.created_at), 'PPp')}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                  Flagged
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Venue: {comment.venues?.name}
                              </p>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCommentFlagMutation.mutate({ 
                                id: comment.id, 
                                isFlagged: false 
                              })}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteCommentMutation.mutate(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No flagged comments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged-replies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Flagged Replies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {repliesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : flaggedReplies && flaggedReplies.length > 0 ? (
                <div className="space-y-4">
                  {flaggedReplies.map((reply) => (
                    <Card key={reply.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                              <AvatarFallback>
                                <User size={20} />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sm">
                                  {reply.profiles?.full_name || 'Anonymous User'}
                                </h4>
                                <span className="text-gray-500 text-xs">
                                  {format(new Date(reply.created_at), 'PPp')}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                  Flagged
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Venue: {reply.venue_comments?.venues?.name}
                              </p>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Flag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No flagged replies</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminModeration;
