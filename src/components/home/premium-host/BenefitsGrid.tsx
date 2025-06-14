
import React from 'react';
import { Users, Calendar, Camera, Star } from 'lucide-react';

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

const benefits: Benefit[] = [
  {
    icon: Users,
    title: 'Reach More Clients',
    description: 'Connect with thousands of event planners actively searching for the perfect venue',
    gradient: 'from-blush-400 to-blush-600'
  },
  {
    icon: Calendar,
    title: 'Smart Booking Management',
    description: 'Automated scheduling, instant notifications, and seamless calendar integration',
    gradient: 'from-champagne-400 to-champagne-600'
  },
  {
    icon: Camera,
    title: 'Professional Photography',
    description: 'Free professional photo shoots to showcase your venue at its absolute best',
    gradient: 'from-gold-400 to-gold-600'
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    description: 'Build trust with authentic reviews from verified guests and event hosts',
    gradient: 'from-blush-500 to-champagne-500'
  }
];

interface BenefitsGridProps {
  isVisible: boolean;
}

const BenefitsGrid: React.FC<BenefitsGridProps> = ({ isVisible }) => {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <div
            key={index}
            className={`group p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-blush-600 dark:group-hover:text-blush-400 transition-colors">
              {benefit.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {benefit.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default BenefitsGrid;
