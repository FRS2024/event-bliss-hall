import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactStars from 'react-rating-stars-component';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface VenueReviewsProps {
  venueId: string;
}

const VenueReviews: React.FC<VenueReviewsProps> = ({ venueId }) => {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('most_recent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch reviews for the venue
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['venue-reviews', venueId, sortBy],
    queryFn: async (): Promise<Review[]> => {
      let query = supabase
        .from('venue_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('venue_id', venueId);

      // Apply sorting
      switch (sortBy) {
        case 'highest_rated':
          query = query.order('rating', { ascending: false }).order('created_at', { ascending: false });
          break;
        case 'lowest_rated':
          query = query.order('rating', { ascending: true }).order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Check if user has already reviewed this venue
  const { data: userReview } = useQuery({
    queryKey: ['user-venue-review', venueId],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('venue_reviews')
        .select('*')
        .eq('venue_id', venueId)
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Authentication required');

      const { data, error } = await supabase
        .from('venue_reviews')
        .insert({
          venue_id: venueId,
          user_id: user.user.id,
          rating,
          comment: comment.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Review submitted successfully!",
        description: "Thank you for your feedback.",
      });
      setNewRating(0);
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['venue-reviews', venueId] });
      queryClient.invalidateQueries({ queryKey: ['user-venue-review', venueId] });
    },
    onError: (error: any) => {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      toast({
        title: "Please select a rating",
        description: "Rating is required to submit a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReviewMutation.mutateAsync({
        rating: newRating,
        comment: newComment,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate average rating and total count
  const averageRating = reviews?.length ? 
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const totalReviews = reviews?.length || 0;

  const renderStars = (rating: number, size: number = 20) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Reviews</h3>
              <div className="flex items-center space-x-2 mt-1">
                {renderStars(Math.round(averageRating), 24)}
                <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-gray-600">({totalReviews} reviews)</span>
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most_recent">Most Recent</SelectItem>
                <SelectItem value="highest_rated">Highest Rated</SelectItem>
                <SelectItem value="lowest_rated">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review Form */}
          {!userReview && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Write a Review</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating *</label>
                  <ReactStars
                    count={5}
                    onChange={setNewRating}
                    size={32}
                    activeColor="#ffd700"
                    color="#e4e5e9"
                    value={newRating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this venue..."
                    rows={3}
                    maxLength={500}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {newComment.length}/500 characters
                  </div>
                </div>
                <Button 
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || newRating === 0}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}

          {userReview && (
            <div className="border-t pt-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  You have already reviewed this venue. Thank you for your feedback!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
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
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    {renderStars(review.rating, 16)}
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <Star className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No reviews yet. Be the first to review this venue!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VenueReviews;
