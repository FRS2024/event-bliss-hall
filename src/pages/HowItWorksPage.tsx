
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Calendar, Heart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HowItWorksPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="page-container py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl mb-6">{t('howItWorks.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="elegant-card text-center">
            <div className="w-20 h-20 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-blush-500 dark:text-blush-400" />
            </div>
            <h3 className="font-serif text-xl mb-4">1. {t('howItWorks.searchDiscover')}</h3>
            <p className="text-muted-foreground">
              {t('howItWorks.searchDiscoverDesc')}
            </p>
          </div>

          <div className="elegant-card text-center">
            <div className="w-20 h-20 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-blush-500 dark:text-blush-400" />
            </div>
            <h3 className="font-serif text-xl mb-4">2. {t('howItWorks.bookYourDate')}</h3>
            <p className="text-muted-foreground">
              {t('howItWorks.bookYourDateDesc')}
            </p>
          </div>

          <div className="elegant-card text-center">
            <div className="w-20 h-20 bg-blush-100 dark:bg-blush-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-blush-500 dark:text-blush-400" />
            </div>
            <h3 className="font-serif text-xl mb-4">3. {t('howItWorks.celebrateTitle')}</h3>
            <p className="text-muted-foreground">
              {t('howItWorks.celebrateSubtitle')}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-champagne-50 dark:bg-champagne-900/20 rounded-lg p-8 mb-16">
          <h2 className="font-script text-3xl text-center mb-8">{t('howItWorks.whyChoose')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">{t('howItWorks.verifiedVenues')}</h4>
                <p className="text-muted-foreground">{t('howItWorks.verifiedVenuesDesc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">{t('howItWorks.secureBooking')}</h4>
                <p className="text-muted-foreground">{t('howItWorks.secureBookingDesc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">{t('howItWorks.support247')}</h4>
                <p className="text-muted-foreground">{t('howItWorks.support247Desc')}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-champagne-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">{t('howItWorks.noHiddenFees')}</h4>
                <p className="text-muted-foreground">{t('howItWorks.noHiddenFeesDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="font-script text-3xl mb-4">{t('howItWorks.readyToStart')}</h2>
          <p className="text-muted-foreground mb-8">
            {t('howItWorks.readyToStartDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/venues">
              <Button className="bg-blush-400 hover:bg-blush-500 text-white px-8 py-3">
                {t('howItWorks.browseVenues')}
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="border-blush-200 text-blush-500 hover:bg-blush-50 dark:border-blush-800 dark:text-blush-400 dark:hover:bg-blush-900/20 px-8 py-3">
                {t('howItWorks.createAccount')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HowItWorksPage;
