import React from 'react';
import { Search, MapPin, Calendar, AlertCircle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateType = 'no-results' | 'no-venues' | 'no-bookings' | 'error' | 'empty';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  suggestions?: string[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const emptyStateConfig = {
  'no-results': {
    icon: Search,
    defaultTitle: 'No venues match your search',
    defaultDescription: 'Try adjusting your filters to find what you\'re looking for.',
    defaultSuggestions: [
      'Expand your price range',
      'Select more categories',
      'Search a different city'
    ]
  },
  'no-venues': {
    icon: MapPin,
    defaultTitle: 'No venues available',
    defaultDescription: 'There are currently no venues listed in this area.',
    defaultSuggestions: []
  },
  'no-bookings': {
    icon: Calendar,
    defaultTitle: 'No bookings yet',
    defaultDescription: 'Your booking history will appear here once you make a reservation.',
    defaultSuggestions: []
  },
  'error': {
    icon: AlertCircle,
    defaultTitle: 'Something went wrong',
    defaultDescription: 'We couldn\'t load the content. Please try again.',
    defaultSuggestions: []
  },
  'empty': {
    icon: Inbox,
    defaultTitle: 'Nothing here yet',
    defaultDescription: 'Content will appear here once it\'s added.',
    defaultSuggestions: []
  }
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  suggestions,
  primaryAction,
  secondaryAction,
  className
}) => {
  const config = emptyStateConfig[type];
  const Icon = config.icon;
  
  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;
  const displaySuggestions = suggestions || config.defaultSuggestions;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-6',
      className
    )}>
      {/* Icon with decorative background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blush-100 dark:bg-blush-900/30 rounded-full blur-xl opacity-60" />
        <div className="relative bg-gradient-to-br from-blush-50 to-champagne-50 dark:from-blush-900/50 dark:to-champagne-900/50 rounded-full p-6 border border-blush-100 dark:border-blush-800">
          <Icon className="w-12 h-12 text-blush-400 dark:text-blush-500" />
        </div>
      </div>
      
      {/* Title */}
      <h3 className="font-display text-xl md:text-2xl text-foreground mb-2">
        {displayTitle}
      </h3>
      
      {/* Description */}
      <p className="text-muted-foreground max-w-md mb-6">
        {displayDescription}
      </p>
      
      {/* Suggestions */}
      {displaySuggestions.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">Try:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {displaySuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blush-400 rounded-full" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {primaryAction && (
            <Button onClick={primaryAction.onClick} className="min-w-[140px]">
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              variant="outline" 
              onClick={secondaryAction.onClick}
              className="min-w-[140px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
