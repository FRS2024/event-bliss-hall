
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/home/Hero';
import VenueGrid from '@/components/venues/VenueGrid';
import { Button } from '@/components/ui/button';
import { Venue } from '@/types';
import { getFeaturedVenues } from '@/lib/api';

const Index: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, this would fetch from your API
    const loadVenues = async () => {
      setIsLoading(true);
      try {
        const data = await getFeaturedVenues();
        setVenues(data);
      } catch (error) {
        console.error('Error loading venues:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVenues();
  }, []);
  
  return (
    <MainLayout>
      <Hero />
      
      <section className="page-container py-16">
        <h2 className="section-title">Featured Venues</h2>
        <VenueGrid venues={venues} isLoading={isLoading} />
        <div className="flex justify-center mt-10">
          <Link to="/venues">
            <Button 
              variant="outline"
              className="border-blush-200 text-blush-500 hover:bg-blush-50 dark:border-blush-800 dark:text-blush-400 dark:hover:bg-blush-900/20 px-8 py-6"
            >
              View All Venues
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="bg-champagne-50 dark:bg-champagne-900/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="elegant-card text-center">
              <div className="w-16 h-16 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-script text-2xl text-blush-500 dark:text-blush-400">1</span>
              </div>
              <h3 className="font-serif text-xl mb-3">Find a Venue</h3>
              <p className="text-muted-foreground">
                Search through our curated collection of beautiful venues for any event type.
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="w-16 h-16 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-script text-2xl text-blush-500 dark:text-blush-400">2</span>
              </div>
              <h3 className="font-serif text-xl mb-3">Book Your Date</h3>
              <p className="text-muted-foreground">
                Select your date, review venue details, and secure your booking online.
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="w-16 h-16 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-script text-2xl text-blush-500 dark:text-blush-400">3</span>
              </div>
              <h3 className="font-serif text-xl mb-3">Celebrate!</h3>
              <p className="text-muted-foreground">
                Enjoy your special day in a perfect venue that matches your vision.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-script text-3xl md:text-4xl text-blush-500 dark:text-blush-400 mb-4">
              List Your Venue With Us
            </h2>
            <p className="text-muted-foreground mb-6">
              Are you a venue owner? Partner with EasyHall to reach more clients and manage your bookings seamlessly. Our platform makes it easy to showcase your space to people planning their special events.
            </p>
            <ul className="space-y-3 mb-6">
              {['Reach more clients', 'Easy booking management', 'Professional photos', 'Verified reviews'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-5 h-5 bg-champagne-100 dark:bg-champagne-900 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-champagne-500 rounded-full"></span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <Button className="bg-blush-400 hover:bg-blush-500 text-white">
                Become a Host
              </Button>
            </Link>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2968&q=80" 
              alt="Venue hosting" 
              className="w-full h-auto" 
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
