
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedHero from '@/components/home/EnhancedHero';
import EnhancedVenueGrid from '@/components/venues/EnhancedVenueGrid';
import PremiumHostSection from '@/components/home/PremiumHostSection';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Venue } from '@/types';
import { getFeaturedVenues } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { Star, Shield, Clock, Award } from 'lucide-react';

const EnhancedIndex: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  
  useEffect(() => {
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
      
      {/* Featured Venues Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900">
        <div className="container-modern">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              ✨ {t('home.featuredVenues')}
            </Badge>
            <h2 className="heading-section text-gray-900 dark:text-white mb-6">
              Discover Premium Venues
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Handpicked locations that offer exceptional experiences for your special moments. 
              Each venue is verified and rated by our community.
            </p>
          </div>
          
          <EnhancedVenueGrid venues={venues} isLoading={isLoading} featured={true} />
          
          <div className="text-center mt-12">
            <Link to="/venues">
              <EnhancedButton 
                variant="outline"
                size="lg"
                className="px-8"
              >
                {t('home.viewAllVenues')}
              </EnhancedButton>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="heading-section text-gray-900 dark:text-white mb-6">
              {t('home.howItWorksTitle')}
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Getting started is simple. Follow these three easy steps to book your perfect venue.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '1',
                title: t('home.findVenue'),
                description: t('home.findVenueDesc'),
                icon: '🔍',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '2',
                title: t('home.bookDate'),
                description: t('home.bookDateDesc'),
                icon: '📅',
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '3',
                title: t('home.celebrate'),
                description: t('home.celebrateDesc'),
                icon: '🎉',
                color: 'from-orange-500 to-red-500'
              }
            ].map((item, index) => (
              <EnhancedCard key={index} variant="elegant" className="text-center p-8 hover-lift">
                <div className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-semibold mb-4">
                    {item.step}
                  </span>
                </div>
                <h3 className="heading-card text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-body">
                  {item.description}
                </p>
              </EnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-padding bg-gradient-to-r from-blush-50 to-champagne-50 dark:from-blush-950/20 dark:to-champagne-950/20">
        <div className="container-modern">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: 'Verified Venues', value: '100%' },
              { icon: Star, label: 'Average Rating', value: '4.9' },
              { icon: Clock, label: 'Quick Response', value: '<2hrs' },
              { icon: Award, label: 'Happy Clients', value: '10K+' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4 hover-scale">
                  <item.icon className="w-8 h-8 text-blush-600 dark:text-blush-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <PremiumHostSection />
    </MainLayout>
  );
};

export default EnhancedIndex;
