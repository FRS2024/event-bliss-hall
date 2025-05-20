
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue } from '@/types';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  
  return (
    <div className="venue-card group">
      <div className="relative">
        <Link to={`/venues/${venue.id}`}>
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="image-overlay" />
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full z-10 hover:bg-white dark:hover:bg-black/70"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart 
            size={20} 
            className={isLiked ? "fill-blush-500 text-blush-500" : "text-gray-700 dark:text-gray-300"} 
          />
        </Button>
        
        <div className="absolute bottom-3 left-3 z-10">
          <span className="category-tag">{venue.category}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/venues/${venue.id}`}>
            <h3 className="font-script text-xl text-foreground hover:text-blush-500 transition-colors">{venue.name}</h3>
          </Link>
          <div className="flex items-center">
            <Star size={16} className="text-champagne-500 mr-1" />
            <span className="text-sm font-medium">{venue.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm truncate">{venue.location}</span>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>Up to {venue.capacity} guests</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{venue.availability}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-script text-xl text-blush-500 dark:text-blush-400">${venue.price}</span>
            <span className="text-muted-foreground text-sm">/day</span>
          </div>
          <Link to={`/venues/${venue.id}`}>
            <Button className="bg-blush-400 hover:bg-blush-500 text-white">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
