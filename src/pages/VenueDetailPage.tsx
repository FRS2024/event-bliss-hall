
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { Venue } from '@/types';
import { getVenueById } from '@/lib/api';

const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    const loadVenue = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const data = await getVenueById(id);
          setVenue(data);
        }
      } catch (error) {
        console.error('Error loading venue:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVenue();
  }, [id]);
  
  const nextImage = () => {
    if (venue) {
      setCurrentImage((prev) => (prev + 1) % venue.images.length);
    }
  };
  
  const prevImage = () => {
    if (venue) {
      setCurrentImage((prev) => (prev - 1 + venue.images.length) % venue.images.length);
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="page-container min-h-[600px] flex items-center justify-center">
          <div className="loader animate-pulse-soft">Loading venue details...</div>
        </div>
      </MainLayout>
    );
  }
  
  if (!venue) {
    return (
      <MainLayout>
        <div className="page-container min-h-[600px] flex flex-col items-center justify-center">
          <h2 className="font-script text-3xl text-blush-500 dark:text-blush-400 mb-4">Venue Not Found</h2>
          <p className="text-muted-foreground mb-6">The venue you're looking for doesn't exist or has been removed.</p>
          <Link to="/venues">
            <Button className="bg-blush-400 hover:bg-blush-500 text-white">
              Browse All Venues
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/venues" className="hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
            Venues
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-foreground">{venue.name}</span>
        </div>
        
        {/* Image Gallery */}
        <div className="relative rounded-lg overflow-hidden mb-8 h-[500px]">
          <img 
            src={venue.images[currentImage]} 
            alt={venue.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70"
            onClick={prevImage}
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70"
            onClick={nextImage}
          >
            <ChevronRight size={24} />
          </Button>
          
          {/* Thumbnail Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {venue.images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImage 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/80 transition-colors'
                }`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
          
          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="category-tag">{venue.category}</span>
          </div>
          
          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart 
              size={20} 
              className={isLiked ? "fill-blush-500 text-blush-500" : "text-white"} 
            />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venue Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-script text-3xl md:text-4xl text-foreground">{venue.name}</h1>
              <div className="flex items-center">
                <Star size={20} className="text-champagne-500 mr-1" />
                <span className="font-medium">{venue.rating}</span>
                <span className="text-muted-foreground ml-1">({venue.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center text-muted-foreground mb-6">
              <MapPin size={18} className="mr-1" />
              <span>{venue.location}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="elegant-card text-center">
                <div className="flex justify-center mb-2">
                  <Users size={24} className="text-blush-500 dark:text-blush-400" />
                </div>
                <h3 className="font-medium mb-1">Capacity</h3>
                <p className="text-muted-foreground">Up to {venue.capacity} guests</p>
              </div>
              
              <div className="elegant-card text-center">
                <div className="flex justify-center mb-2">
                  <Calendar size={24} className="text-blush-500 dark:text-blush-400" />
                </div>
                <h3 className="font-medium mb-1">Availability</h3>
                <p className="text-muted-foreground">{venue.availability}</p>
              </div>
              
              <div className="elegant-card text-center">
                <div className="flex justify-center mb-2">
                  <span className="text-xl font-script text-blush-500 dark:text-blush-400">$</span>
                </div>
                <h3 className="font-medium mb-1">Price</h3>
                <p className="text-muted-foreground">${venue.price} per day</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4">About this venue</h2>
              <p className="text-muted-foreground mb-4">{venue.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {venue.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blush-400 rounded-full mr-2"></span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4">Location</h2>
              <div className="h-80 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-muted-foreground">Map will be integrated here</p>
              </div>
              <p className="text-muted-foreground mt-3">{venue.location}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4">Reviews</h2>
              
              {venue.reviews && venue.reviews.length > 0 ? (
                <div className="space-y-4">
                  {venue.reviews.map((review, index) => (
                    <div key={index} className="subtle-card">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.name}</div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? "text-champagne-500 fill-champagne-500" : "text-gray-300 dark:text-gray-600"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <div className="text-sm text-muted-foreground mt-2">{review.date}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 elegant-card">
              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-script text-2xl text-blush-500 dark:text-blush-400">${venue.price}</span>
                  <span className="text-muted-foreground">per day</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Date</label>
                  <input
                    type="date"
                    className="elegant-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Number of Guests</label>
                  <select className="elegant-input">
                    <option value="">Select number of guests</option>
                    <option value="1-50">1-50 guests</option>
                    <option value="51-100">51-100 guests</option>
                    <option value="101-200">101-200 guests</option>
                    <option value="201-300">201-300 guests</option>
                    <option value="301+">301+ guests</option>
                  </select>
                </div>
                
                <Button className="w-full bg-blush-400 hover:bg-blush-500 text-white mb-4">
                  Book Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-blush-200 text-blush-500 hover:bg-blush-50 dark:border-blush-800 dark:text-blush-400 dark:hover:bg-blush-900/20"
                >
                  Contact Host
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p>You won't be charged yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VenueDetailPage;
