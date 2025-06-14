
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Calendar, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="page-container py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl mb-6">How EasyHall Works</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the simple process of finding and booking your perfect venue for any occasion.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="elegant-card text-center">
            <div className="w-20 h-20 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-blush-500 dark:text-blush-400" />
            </div>
            <h3 className="font-serif text-xl mb-4">1. Search & Discover</h3>
            <p className="text-muted-foreground">
              Browse our curated collection of venues by location, date, and event type. Use our smart filters to find exactly what you're looking for.
            </p>
          </div>

          <div className="elegant-card text-center">
            <div className="w-20 h-20 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-blush-500 dark:text-blush-400" />
            </div>
            <h3 className="font-serif text-xl mb-4">2. Book Your Date</h3>
            <p className="text-muted-foreground">
              Select your preferred date, review pricing and amenities, then secure your booking with our easy online process.
            </p>
          </div>

          <div className="elegant-card text-center">
            <div className="w-20 h-20 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-blush-500 dark:text-blush-400" />
            </div>
            <h3 className="font-serif text-xl mb-4">3. Celebrate!</h3>
            <p className="text-muted-foreground">
              Enjoy your special event in a beautiful venue that perfectly matches your vision and budget.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-champagne-50 dark:bg-champagne-900/20 rounded-lg p-8 mb-16">
          <h2 className="font-script text-3xl text-center mb-8">Why Choose EasyHall?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Verified Venues</h4>
                <p className="text-muted-foreground">All venues are thoroughly vetted and verified for quality and reliability.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Secure Booking</h4>
                <p className="text-muted-foreground">Your payments are protected with secure processing and booking guarantee.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">24/7 Support</h4>
                <p className="text-muted-foreground">Our dedicated support team is here to help you every step of the way.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">No Hidden Fees</h4>
                <p className="text-muted-foreground">Transparent pricing with no surprise charges or hidden fees.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="font-script text-3xl mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Find your perfect venue today and make your event unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/venues">
              <Button className="bg-blush-400 hover:bg-blush-500 text-white px-8 py-3">
                Browse Venues
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="border-blush-200 text-blush-500 hover:bg-blush-50 dark:border-blush-800 dark:text-blush-400 dark:hover:bg-blush-900/20 px-8 py-3">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HowItWorksPage;
