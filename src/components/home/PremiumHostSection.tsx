
import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import StatsBar from './premium-host/StatsBar';
import BenefitsGrid from './premium-host/BenefitsGrid';
import HostCTAForm from './premium-host/HostCTAForm';
import TestimonialsCarousel from './premium-host/TestimonialsCarousel';
import VenueShowcase from './premium-host/VenueShowcase';

const PremiumHostSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('host-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="host-section" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blush-50 via-champagne-50 to-gold-50 dark:from-blush-950 dark:via-champagne-950 dark:to-gold-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blush-200/30 to-champagne-200/30 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-champagne-200/30 to-gold-200/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <StatsBar />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blush-100 to-champagne-100 dark:from-blush-900/50 dark:to-champagne-900/50 rounded-full px-4 py-2">
                <TrendingUp className="w-4 h-4 text-blush-600 dark:text-blush-400" />
                <span className="text-sm font-medium text-blush-700 dark:text-blush-300">Join 10,000+ Successful Hosts</span>
              </div>
              
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blush-600 via-champagne-600 to-gold-600 bg-clip-text text-transparent leading-snug tracking-wide">
                Transform Your Space Into Profit
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Join the most trusted platform for venue hosts. Turn your beautiful space into a thriving business with our premium tools, professional support, and guaranteed bookings.
              </p>
            </div>

            <BenefitsGrid isVisible={isVisible} />
            <HostCTAForm />
          </div>

          {/* Visual Side */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <VenueShowcase isVisible={isVisible} />
            <TestimonialsCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHostSection;
