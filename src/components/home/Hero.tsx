
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSearch from './HeroSearch';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  
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
            {t('hero.title', 'Find Your Perfect Celebration Venue')}
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle', 'Discover beautiful spaces for weddings, birthdays, corporate events and special occasions. Book with confidence and celebrate in style.')}
          </p>
          
          {/* Search Box */}
          <HeroSearch />
          
          <div className="flex flex-wrap gap-3 mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/categories?category=wedding" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
              {t('categories.wedding')}
            </Link>
            <Link to="/categories?category=birthday" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
              {t('categories.birthday')}
            </Link>
            <Link to="/categories?category=corporate" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
              {t('categories.corporate')}
            </Link>
            <Link to="/categories?category=reception" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
              {t('categories.reception', 'Reception')}
            </Link>
            <Link to="/categories?category=party" className="category-tag hover:bg-champagne-200 dark:hover:bg-champagne-800 transition-colors">
              {t('categories.party')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
