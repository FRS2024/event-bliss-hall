import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSearch from './HeroSearch';
import StatsBar from './premium-host/StatsBar';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="relative min-h-[650px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Hero Background with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-105"
          />
        </div>
        {/* Enhanced gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="max-w-3xl">
          {/* Headline with staggered reveal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            <span className="block font-sans font-bold animate-fade-in">
              {t('hero.title', 'Find Your Perfect')}
            </span>
            <span 
              className="block font-display text-blush-300 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              {t('hero.titleAccent', 'Celebration Venue')}
            </span>
          </h1>
          
          <p 
            className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl animate-fade-in leading-relaxed" 
            style={{ animationDelay: '0.4s' }}
          >
            {t('hero.subtitle', 'Discover beautiful spaces for weddings, birthdays, corporate events and special occasions. Book with confidence and celebrate in style.')}
          </p>
          
          {/* Inline Trust Stats */}
          <div 
            className="mb-8 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <StatsBar />
          </div>
          
          {/* Search Box */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <HeroSearch />
          </div>
          
          {/* Category Quick Links */}
          <div 
            className="flex flex-wrap gap-3 mt-6 animate-fade-in" 
            style={{ animationDelay: '0.8s' }}
          >
            <Link 
              to="/categories?category=wedding" 
              className="category-tag bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              {t('categories.wedding')}
            </Link>
            <Link 
              to="/categories?category=birthday" 
              className="category-tag bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              {t('categories.birthday')}
            </Link>
            <Link 
              to="/categories?category=corporate" 
              className="category-tag bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              {t('categories.corporate')}
            </Link>
            <Link 
              to="/categories?category=engagement" 
              className="category-tag bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              {t('categories.engagement', 'Engagement')}
            </Link>
            <Link 
              to="/categories?category=party" 
              className="category-tag bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              {t('categories.party')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
