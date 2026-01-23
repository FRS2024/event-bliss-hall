
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Building, MapPin, DollarSign, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: string;
  venueCount: number;
  priceRange: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  venueCount, 
  priceRange 
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    // Navigate to venues page with category filter
    navigate(`/venues?category=${encodeURIComponent(category)}`);
  };

  // Get category icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Wedding Hall': '💒',
      'Conference Room': '🏢',
      'Restaurant & Café': '🍽️',
      'Outdoor Garden': '🌳',
      'Event Center': '🎪',
      'Hotel & Resort': '🏨',
      'Cultural Center': '🎭',
      'Sports Facility': '⚽',
      'Private Villa': '🏡',
      'Rooftop & Terrace': '🏙️',
      'Banquet Hall': '🍾',
      'Community Center': '🏛️',
      'Art Gallery': '🎨',
      'Theater': '🎬',
      'Beach Club': '🏖️'
    };
    
    return iconMap[categoryName] || '🏢';
  };

  // Get category description
  const getCategoryDescription = (categoryName: string) => {
    const descriptions: { [key: string]: string } = {
      'Wedding Hall': 'Elegant spaces designed for your perfect wedding celebration',
      'Conference Room': 'Professional venues ideal for business meetings and conferences',
      'Restaurant & Café': 'Cozy dining spaces perfect for intimate gatherings',
      'Outdoor Garden': 'Beautiful outdoor spaces surrounded by nature',
      'Event Center': 'Versatile venues suitable for any type of celebration',
      'Hotel & Resort': 'Luxury accommodations with event facilities',
      'Cultural Center': 'Historic and cultural venues with unique character',
      'Sports Facility': 'Active venues perfect for sports events and activities',
      'Private Villa': 'Exclusive private properties for intimate celebrations',
      'Rooftop & Terrace': 'Stunning elevated venues with panoramic views',
      'Banquet Hall': 'Grand halls designed for large celebrations',
      'Community Center': 'Community spaces ideal for local gatherings',
      'Art Gallery': 'Creative spaces perfect for artistic events',
      'Theater': 'Performance venues with exceptional acoustics',
      'Beach Club': 'Coastal venues with stunning water views'
    };
    
    return descriptions[categoryName] || 'Discover amazing venues in this category';
  };

  return (
    <Card className="venue-card group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 relative overflow-hidden hover:ring-2 hover:ring-blush-200 dark:hover:ring-blush-800">
      <CardContent className="p-0" onClick={handleCategoryClick}>
        {/* Category Header with Enhanced Gradient Animation */}
        <div className="bg-gradient-to-br from-blush-400 to-champagne-400 group-hover:from-blush-500 group-hover:to-champagne-500 p-8 text-center text-white transition-all duration-500 relative overflow-hidden">
          {/* Subtle glow effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-500" />
          
          {/* Animated Icon */}
          <div className="text-4xl mb-3 transition-all duration-300 group-hover:scale-125 group-hover:animate-pulse-soft relative z-10">
            {getCategoryIcon(category)}
          </div>
          
          <h3 className="font-script text-xl font-semibold relative z-10 group-hover:text-white transition-colors duration-300">
            {category}
          </h3>
        </div>
        
        {/* Category Info with Enhanced Animations */}
        <div className="p-6 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blush-50/50 group-hover:to-champagne-50/50 dark:group-hover:from-blush-900/20 dark:group-hover:to-champagne-900/20">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed transition-all duration-300 group-hover:text-foreground/80">
            {getCategoryDescription(category)}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm transition-all duration-300 group-hover:translate-x-1">
              <Building size={16} className="me-2 text-blush-400 group-hover:text-blush-500 transition-colors duration-300" />
              <span className="font-medium">{venueCount}</span>
              <span className="text-muted-foreground ms-1">
                {venueCount === 1 ? 'venue' : 'venues'}
              </span>
            </div>
            
            <div className="flex items-center text-sm transition-all duration-300 group-hover:translate-x-1">
              <DollarSign size={16} className="me-2 text-champagne-500 group-hover:text-champagne-600 transition-colors duration-300" />
              <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{priceRange}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-blush-400 hover:bg-blush-500 text-white transition-all duration-300 group-hover:bg-blush-500 group-hover:shadow-lg relative overflow-hidden"
          onClick={handleCategoryClick}
        >
          <span className="flex items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-1">
            Explore {category}
            <ArrowRight 
              size={16} 
              className="transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 rtl:rotate-180 rtl:translate-x-2 rtl:group-hover:-translate-x-0" 
            />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
