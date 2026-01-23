import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue } from '@/types';
import { cn } from '@/lib/utils';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = venue.images || [];
  const hasMultipleImages = images.length > 1;
  
  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Determine price display
  const priceDisplay = () => {
    if (venue.price_per_day) return `${venue.price_per_day} DA/day`;
    if (venue.price_per_hour) return `${venue.price_per_hour} DA/hr`;
    if (venue.price_per_event) return `${venue.price_per_event} DA/event`;
    return `${venue.price} DA`;
  };
  
  return (
    <div className="venue-card group">
      <div className="relative overflow-hidden rounded-t-xl">
        <Link to={`/venues/${venue.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={images[currentImageIndex] || '/placeholder.svg'}
              alt={venue.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="image-overlay" />
          </div>
        </Link>
        
        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevImage}
              className={cn(
                "absolute start-2 top-1/2 -translate-y-1/2 z-20",
                "w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-md",
                "text-foreground hover:bg-white dark:hover:bg-black/90",
                "opacity-0 group-hover:opacity-100 transition-all duration-300"
              )}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextImage}
              className={cn(
                "absolute end-2 top-1/2 -translate-y-1/2 z-20",
                "w-8 h-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-md",
                "text-foreground hover:bg-white dark:hover:bg-black/90",
                "opacity-0 group-hover:opacity-100 transition-all duration-300"
              )}
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </>
        )}
        
        {/* Dot Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentImageIndex 
                    ? "bg-white w-3" 
                    : "bg-white/60 hover:bg-white/80"
                )}
              />
            ))}
            {images.length > 5 && (
              <span className="text-white text-xs ml-1">+{images.length - 5}</span>
            )}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 end-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full z-10 hover:bg-white dark:hover:bg-black/70"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart 
            size={20} 
            className={isLiked ? "fill-blush-500 text-blush-500" : "text-gray-700 dark:text-gray-300"} 
          />
        </Button>
        
        <div className="absolute bottom-3 start-3 z-10">
          <span className="category-tag">{venue.category}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/venues/${venue.id}`}>
            <h3 className="font-script text-xl text-foreground hover:text-blush-500 transition-colors">{venue.name}</h3>
          </Link>
          <div className="flex items-center">
            <Star size={16} className="text-champagne-500 me-1" />
            <span className="text-sm font-medium">{venue.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin size={16} className="me-1" />
          <span className="text-sm truncate">{venue.city}</span>
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users size={16} className="me-1" />
            <span>Up to {venue.capacity} guests</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="me-1" />
            <span>{venue.availability}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="font-script text-xl text-blush-500 dark:text-blush-400">{priceDisplay()}</span>
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
