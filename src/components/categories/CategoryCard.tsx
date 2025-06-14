
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Building, MapPin, DollarSign } from 'lucide-react';

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
    <Card className="venue-card group cursor-pointer transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-0" onClick={handleCategoryClick}>
        {/* Category Header */}
        <div className="bg-gradient-to-br from-blush-400 to-champagne-400 p-8 text-center text-white">
          <div className="text-4xl mb-3">
            {getCategoryIcon(category)}
          </div>
          <h3 className="font-script text-xl font-semibold">
            {category}
          </h3>
        </div>
        
        {/* Category Info */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {getCategoryDescription(category)}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Building size={16} className="mr-2 text-blush-400" />
              <span className="font-medium">{venueCount}</span>
              <span className="text-muted-foreground ml-1">
                {venueCount === 1 ? 'venue' : 'venues'}
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <DollarSign size={16} className="mr-2 text-champagne-500" />
              <span className="text-muted-foreground">{priceRange}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-blush-400 hover:bg-blush-500 text-white"
          onClick={handleCategoryClick}
        >
          Explore {category}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
