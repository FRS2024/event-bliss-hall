
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/home/Hero';
import VenueGrid from '@/components/venues/VenueGrid';
import PremiumHostSection from '@/components/home/PremiumHostSection';
import { Button } from '@/components/ui/button';
import { Venue } from '@/types';
import { getFeaturedVenues } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';

const Index: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle role selection redirect for OAuth users
  useRoleRedirect();
  const { t } = useTranslation();
  
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
        <h2 className="section-title">{t('home.featuredVenues')}</h2>
        <VenueGrid venues={venues} isLoading={isLoading} />
        <div className="flex justify-center mt-10">
          <Link to="/venues">
            <Button 
              variant="outline"
              className="border-blush-200 text-blush-500 hover:bg-blush-50 dark:border-blush-800 dark:text-blush-400 dark:hover:bg-blush-900/20 px-8 py-6"
            >
              {t('home.viewAllVenues')}
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="bg-champagne-50 dark:bg-champagne-900/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">{t('home.howItWorksTitle')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="elegant-card text-center">
              <div className="w-16 h-16 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-script text-2xl text-blush-500 dark:text-blush-400">1</span>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('home.findVenue')}</h3>
              <p className="text-muted-foreground">
                {t('home.findVenueDesc')}
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="w-16 h-16 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-script text-2xl text-blush-500 dark:text-blush-400">2</span>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('home.bookDate')}</h3>
              <p className="text-muted-foreground">
                {t('home.bookDateDesc')}
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="w-16 h-16 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-script text-2xl text-blush-500 dark:text-blush-400">3</span>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('home.celebrate')}</h3>
              <p className="text-muted-foreground">
                {t('home.celebrateDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <PremiumHostSection />
    </MainLayout>
  );
};

export default Index;
