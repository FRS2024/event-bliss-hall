import React from 'react';
import { BadgeCheck, Zap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeType = 'verified' | 'instant' | 'featured';

interface VerifiedBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

const badgeConfig = {
  verified: {
    icon: BadgeCheck,
    label: 'Verified Host',
    labelAr: 'مضيف موثق',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  instant: {
    icon: Zap,
    label: 'Instant Booking',
    labelAr: 'حجز فوري',
    bgColor: 'bg-green-50 dark:bg-green-950',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  featured: {
    icon: Award,
    label: 'Featured',
    labelAr: 'مميز',
    bgColor: 'bg-gold-50 dark:bg-gold-950',
    textColor: 'text-gold-600 dark:text-gold-400',
    borderColor: 'border-gold-200 dark:border-gold-800'
  }
};

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  type,
  size = 'sm',
  showLabel = true,
  className
}) => {
  const config = badgeConfig[type];
  const Icon = config.icon;
  
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        config.bgColor,
        config.textColor,
        config.borderColor,
        padding,
        textSize,
        className
      )}
    >
      <Icon className={iconSize} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default VerifiedBadge;
