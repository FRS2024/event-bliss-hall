import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PartyPopper, Calendar, Star, Wallet } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  targetNumber: number;
  suffix: string;
  labelKey: string;
  fallbackLabel: string;
}

const stats: Stat[] = [
  { 
    icon: <PartyPopper className="w-5 h-5 text-blush-500" />,
    targetNumber: 10000, 
    suffix: '+', 
    labelKey: 'home.stats.happyHosts',
    fallbackLabel: 'Happy Hosts' 
  },
  { 
    icon: <Calendar className="w-5 h-5 text-blush-500" />,
    targetNumber: 50000, 
    suffix: '+', 
    labelKey: 'home.stats.bookingsMade',
    fallbackLabel: 'Bookings Made' 
  },
  { 
    icon: <Star className="w-5 h-5 text-gold-500" />,
    targetNumber: 98, 
    suffix: '%', 
    labelKey: 'home.stats.satisfaction',
    fallbackLabel: 'Satisfaction' 
  },
  { 
    icon: <Wallet className="w-5 h-5 text-blush-500" />,
    targetNumber: 250, 
    suffix: 'M+ DA', 
    labelKey: 'home.stats.hostEarnings',
    fallbackLabel: 'Host Earnings' 
  }
];

// Custom hook for count-up animation
const useCountUp = (targetNumber: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * targetNumber));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetNumber, duration, shouldStart]);

  return count;
};

const StatItem: React.FC<{ stat: Stat; isVisible: boolean }> = ({ stat, isVisible }) => {
  const { t } = useTranslation();
  const count = useCountUp(stat.targetNumber, 2000, isVisible);
  
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="flex flex-col items-center gap-1 min-w-[120px] snap-center px-4 py-3">
      <div className="flex items-center gap-2">
        {stat.icon}
        <span className="font-display text-xl md:text-2xl text-blush-600 dark:text-blush-400 tabular-nums">
          {formatNumber(count)}{stat.suffix}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
        {t(stat.labelKey, stat.fallbackLabel)}
      </span>
    </div>
  );
};

const StatsBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="text-center mb-12" ref={containerRef}>
      {/* Desktop: All stats visible in row */}
      <div className="hidden md:inline-flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-champagne-100 dark:border-champagne-800">
        <div className="flex items-center divide-x divide-champagne-200 dark:divide-champagne-700">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
      
      {/* Mobile: Horizontal scroll with snap */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="inline-flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl px-2 py-2 shadow-lg border border-champagne-100 dark:border-champagne-800 snap-x snap-mandatory">
          <div className="flex items-center gap-1">
            {stats.map((stat, index) => (
              <StatItem key={index} stat={stat} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll hint for mobile */}
      <p className="md:hidden text-xs text-muted-foreground mt-2 animate-pulse">
        ← Scroll to see more →
      </p>
    </div>
  );
};

export default StatsBar;
