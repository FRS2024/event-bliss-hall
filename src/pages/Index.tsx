
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedHero from '@/components/home/EnhancedHero';
import EnhancedVenueGrid from '@/components/venues/EnhancedVenueGrid';
import PremiumHostSection from '@/components/home/PremiumHostSection';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Venue } from '@/types';
import { getFeaturedVenues } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const Index: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      <EnhancedHero />
      
      <section className="section-padding">
        <div className="container-modern">
          <h2 className="heading-section text-center text-gray-900 dark:text-white mb-12">
            {t('home.featuredVenues')}
          </h2>
          <EnhancedVenueGrid venues={venues} isLoading={isLoading} featured={true} />
          <div className="flex justify-center mt-12">
            <Link to="/venues">
              <EnhancedButton 
                variant="outline"
                size="lg"
                className="px-12"
              >
                {t('home.viewAllVenues')}
              </EnhancedButton>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="bg-gradient-to-br from-champagne-50 to-blush-50/30 dark:from-champagne-900/20 dark:to-blush-900/10 section-padding">
        <div className="container-modern">
          <h2 className="heading-section text-center text-gray-900 dark:text-white mb-16">
            {t('home.howItWorksTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="card-modern text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blush-100 to-blush-200 dark:from-blush-900/50 dark:to-blush-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                <span className="font-script text-3xl text-blush-600 dark:text-blush-400 font-bold">1</span>
              </div>
              <h3 className="heading-card text-gray-900 dark:text-white mb-4">{t('home.findVenue')}</h3>
              <p className="text-body">
                {t('home.findVenueDesc')}
              </p>
            </div>
            
            <div className="card-modern text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-champagne-100 to-champagne-200 dark:from-champagne-900/50 dark:to-champagne-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                <span className="font-script text-3xl text-champagne-600 dark:text-champagne-400 font-bold">2</span>
              </div>
              <h3 className="heading-card text-gray-900 dark:text-white mb-4">{t('home.bookDate')}</h3>
              <p className="text-body">
                {t('home.bookDateDesc')}
              </p>
            </div>
            
            <div className="card-modern text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900/50 dark:to-gold-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                <span className="font-script text-3xl text-gold-600 dark:text-gold-400 font-bold">3</span>
              </div>
              <h3 className="heading-card text-gray-900 dark:text-white mb-4">{t('home.celebrate')}</h3>
              <p className="text-body">
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
