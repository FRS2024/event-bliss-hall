
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Calendar, Users, Wifi, Car, Coffee } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Venue } from '@/types';
import { useTranslation } from 'react-i18next';

interface EnhancedVenueCardProps {
  venue: Venue;
  featured?: boolean;
}

const EnhancedVenueCard: React.FC<EnhancedVenueCardProps> = ({ venue, featured = false }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const { t } = useTranslation();
  
  // Sample amenities - in a real app this would come from venue data
  const amenities = [
    { icon: Wifi, label: 'WiFi' },
    { icon: Car, label: 'Parking' },
    { icon: Coffee, label: 'Catering' }
  ];
  
  // Determine price display
  const priceDisplay = () => {
    if (venue.price_per_day) return `${venue.price_per_day} DA/day`;
    if (venue.price_per_hour) return `${venue.price_per_hour} DA/hr`;
    if (venue.price_per_event) return `${venue.price_per_event} DA/event`;
    return `${venue.price} DA`;
  };
  
  return (
    <EnhancedCard 
      variant={featured ? "featured" : "modern"} 
      className={`group overflow-hidden ${featured ? 'col-span-1 sm:col-span-2 lg:col-span-1' : ''}`}
    >
      <div className="relative overflow-hidden">
        <Link to={`/venues/${venue.id}`}>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={venue.images[0] || '/placeholder.svg'}
              alt={venue.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95 z-10"
        >
          <Heart 
            size={18} 
            className={`transition-colors duration-200 ${
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            }`} 
          />
        </button>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            variant="secondary" 
            className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium px-3 py-1.5 rounded-lg shadow-sm"
          >
            {venue.category}
          </Badge>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-900">{venue.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <Link to={`/venues/${venue.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-white truncate hover:text-blush-600 transition-colors duration-200">
              {venue.name}
            </h3>
          </Link>
          <div className="ml-4 text-right">
            <span className="text-2xl font-bold text-blush-600 dark:text-blush-400">
              {priceDisplay().split(' ')[0]}
            </span>
            <span className="text-sm text-gray-500 block">
              {priceDisplay().split(' ').slice(1).join(' ')}
            </span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{venue.city}</span>
        </div>
        
        {/* Details */}
        <div className="flex items-center gap-6 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{venue.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{venue.availability}</span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="flex items-center gap-3 mb-6">
          {amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 text-xs text-gray-500">
              <amenity.icon size={14} />
              <span>{amenity.label}</span>
            </div>
          ))}
        </div>
        
        {/* Action Button */}
        <Link to={`/venues/${venue.id}`} className="block w-full">
          <EnhancedButton 
            variant="default" 
            size="lg" 
            fullWidth={true}
            className="font-semibold"
          >
            {t('venues.viewDetails')}
          </EnhancedButton>
        </Link>
      </div>
    </EnhancedCard>
  );
};

export default EnhancedVenueCard;
