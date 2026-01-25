import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, Users, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Venue } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const handleContactHost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to venue page with contact intent
    navigate(`/venues/${venue.id}?contact=true`);
  };
  
  // Format price with "From" prefix for clarity
  const priceDisplay = () => {
    const formatPrice = (price: number) => price.toLocaleString();
    if (venue.price_per_day) return { amount: formatPrice(venue.price_per_day), unit: t('venues.perDay', '/day') };
    if (venue.price_per_hour) return { amount: formatPrice(venue.price_per_hour), unit: t('venues.perHour', '/hr') };
    if (venue.price_per_event) return { amount: formatPrice(venue.price_per_event), unit: t('venues.perEvent', '/event') };
    return { amount: formatPrice(venue.price || 0), unit: '' };
  };

  const price = priceDisplay();
  
  return (
    <div className="venue-card group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-xl">
        <Link to={`/venues/${venue.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={images[currentImageIndex] || '/placeholder.svg'}
              alt={venue.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="image-overlay" />
          </div>
        </Link>
        
        {/* Navigation Arrows - ALWAYS visible on mobile, hover on desktop */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevImage}
              className={cn(
                "absolute start-2 top-1/2 -translate-y-1/2 z-20",
                "w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-md",
                "text-foreground hover:bg-white dark:hover:bg-black/90",
                "md:opacity-0 md:group-hover:opacity-100 transition-all duration-300",
                "touch-manipulation"
              )}
              aria-label={t('common.previous', 'Previous image')}
            >
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextImage}
              className={cn(
                "absolute end-2 top-1/2 -translate-y-1/2 z-20",
                "w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-md",
                "text-foreground hover:bg-white dark:hover:bg-black/90",
                "md:opacity-0 md:group-hover:opacity-100 transition-all duration-300",
                "touch-manipulation"
              )}
              aria-label={t('common.next', 'Next image')}
            >
              <ChevronRight className="h-5 w-5 rtl:rotate-180" />
            </Button>
          </>
        )}
        
        {/* Dot Indicators - Always visible */}
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
                  "w-2 h-2 rounded-full transition-all duration-300 touch-manipulation",
                  index === currentImageIndex 
                    ? "bg-white w-4" 
                    : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
            {images.length > 5 && (
              <span className="text-white text-xs ms-1">+{images.length - 5}</span>
            )}
          </div>
        )}
        
        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 end-2 w-10 h-10 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full z-10 hover:bg-white dark:hover:bg-black/70 touch-manipulation"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          aria-label={isLiked ? t('common.unlike', 'Unlike') : t('common.like', 'Like')}
        >
          <Heart 
            size={20} 
            className={isLiked ? "fill-blush-500 text-blush-500" : "text-gray-700 dark:text-gray-300"} 
          />
        </Button>
        
        {/* Category Badge */}
        <div className="absolute bottom-3 start-3 z-10">
          <span className="category-tag">{venue.category}</span>
        </div>
      </div>
      
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <Link to={`/venues/${venue.id}`} className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-foreground hover:text-blush-500 transition-colors truncate">
              {venue.name}
            </h3>
          </Link>
          <div className="flex items-center shrink-0 ms-2">
            <Star size={16} className="text-gold-500 fill-gold-500 me-1" />
            <span className="text-sm font-medium">{venue.rating}</span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin size={16} className="me-1 shrink-0" />
          <span className="text-sm truncate">{venue.city}</span>
        </div>
        
        {/* Capacity */}
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Users size={16} className="me-1 shrink-0" />
          <span>{t('venues.upToGuests', { count: venue.capacity, defaultValue: `Up to ${venue.capacity} guests` })}</span>
        </div>
        
        {/* Price Block with trust indicators */}
        <div className="bg-champagne-50 dark:bg-champagne-950/50 rounded-lg p-3 mb-4 border border-champagne-100 dark:border-champagne-900">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">{t('venues.from', 'From')}</span>
            <span className="font-display text-xl text-blush-600 dark:text-blush-400">
              {price.amount} DA
            </span>
            <span className="text-sm text-muted-foreground">{price.unit}</span>
          </div>
          <div className="mt-2">
            <VerifiedBadge type="instant" size="sm" />
          </div>
        </div>
        
        {/* Dual CTAs - Primary Book + Secondary Contact */}
        <div className="flex flex-col gap-2">
          <Link to={`/venues/${venue.id}`} className="w-full">
            <Button 
              className="w-full bg-blush-500 hover:bg-blush-600 text-white min-h-[44px]"
              pulse
            >
              {t('venues.bookThisVenue', 'Book This Venue')}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full min-h-[44px] gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-400"
            onClick={handleContactHost}
          >
            <MessageCircle size={18} />
            {t('venues.contactHost', 'Contact Host')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
