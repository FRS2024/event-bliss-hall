
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Calendar, Users, Star } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import HeroSearch from './HeroSearch';

const EnhancedHero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blush-600/90 via-champagne-600/80 to-gold-600/70 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Wedding venue" 
          className="w-full h-full object-cover"
        />
        {/* Animated elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-champagne-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Content */}
      <div className="container-modern relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 animate-fade-in">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-medium">
              Trusted by 10,000+ Event Hosts
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="heading-hero text-white mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
              Celebration Venue
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Discover beautiful spaces for weddings, birthdays, corporate events and special occasions. 
            Book with confidence and celebrate in style.
          </p>
          
          {/* Enhanced Search Box */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <EnhancedCard variant="glass" className="p-8 max-w-4xl mx-auto">
              <HeroSearch />
            </EnhancedCard>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {[
              { number: '10K+', label: 'Happy Customers' },
              { number: '2K+', label: 'Premium Venues' },
              { number: '50+', label: 'Cities Covered' },
              { number: '4.9', label: 'Average Rating' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Category Tags */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '1s' }}>
            {[
              { key: 'wedding', label: t('categories.wedding') },
              { key: 'birthday', label: t('categories.birthday') },
              { key: 'corporate', label: t('categories.corporate') },
              { key: 'reception', label: 'Receptions' },
              { key: 'party', label: t('categories.party') }
            ].map((category) => (
              <Link 
                key={category.key}
                to={`/categories?category=${category.key}`} 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
          <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;
