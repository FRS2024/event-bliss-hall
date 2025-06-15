
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageCircle } from 'lucide-react';
import VenueReviews from './reviews/VenueReviews';
import VenueComments from './comments/VenueComments';

interface VenueReviewsAndCommentsProps {
  venueId: string;
}

const VenueReviewsAndComments: React.FC<VenueReviewsAndCommentsProps> = ({ venueId }) => {
  return (
    <div className="mt-8">
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Comments</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="mt-6">
          <VenueReviews venueId={venueId} />
        </TabsContent>
        
        <TabsContent value="comments" className="mt-6">
          <VenueComments venueId={venueId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VenueReviewsAndComments;
