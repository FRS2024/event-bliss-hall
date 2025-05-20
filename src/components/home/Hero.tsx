
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[600px] flex items-center">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Wedding venue" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4 animate-fade-in">
            Find Your Perfect Celebration Venue
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover beautiful spaces for weddings, birthdays, corporate events and special occasions. Book with confidence and celebrate in style.
          </p>
          
          {/* Search Box */}
          <div 
            className="bg-white dark:bg-card p-4 md:p-6 rounded-lg shadow-lg animate-fade-in" 
            style={{ animationDelay: '0.4s' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={20} className="text-muted-foreground" />
                </div>
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="elegant-input pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={20} className="text-muted-foreground" />
                </div>
                <input 
                  type="text" 
                  placeholder="Event Date" 
                  className="elegant-input pl-10"
                />
              </div>
              
              <div>
                <Button className="w-full bg-blush-400 hover:bg-blush-500 text-white">
                  <Search size={20} className="mr-2" />
                  Find Venues
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/categories/wedding" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
                Weddings
              </Link>
              <Link to="/categories/birthday" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
                Birthdays
              </Link>
              <Link to="/categories/corporate" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
                Corporate
              </Link>
              <Link to="/categories/reception" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
                Receptions
              </Link>
              <Link to="/categories/party" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
                Parties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
