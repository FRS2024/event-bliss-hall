
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SmartAvatarProps {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SmartAvatar: React.FC<SmartAvatarProps> = ({
  src,
  alt = '',
  fallbackText = '',
  className,
  size = 'md'
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState(src);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  const getInitials = (text: string) => {
    if (!text) return '?';
    const words = text.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  // Reset error state and update src when src prop changes
  React.useEffect(() => {
    if (src !== currentSrc) {
      console.log('🔄 SmartAvatar src changed:', { old: currentSrc, new: src });
      setCurrentSrc(src);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [src, currentSrc]);

  // Debug logging
  React.useEffect(() => {
    console.log('🎨 SmartAvatar state:', {
      src: currentSrc,
      fallbackText,
      imageError,
      imageLoaded
    });
  }, [currentSrc, fallbackText, imageError, imageLoaded]);

  const handleImageError = () => {
    console.log('❌ SmartAvatar - Image failed to load:', currentSrc);
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    console.log('✅ SmartAvatar - Image loaded successfully:', currentSrc);
    setImageLoaded(true);
    setImageError(false);
  };

  // Add cache-busting key to force re-render when src changes
  const avatarKey = React.useMemo(() => {
    return currentSrc ? `${currentSrc}-${Date.now()}` : 'no-image';
  }, [currentSrc]);

  return (
    <Avatar key={avatarKey} className={cn(sizeClasses[size], className)}>
      {currentSrc && !imageError && (
        <AvatarImage 
          src={currentSrc} 
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
          // Force reload by adding key
          key={currentSrc}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
        {getInitials(fallbackText)}
      </AvatarFallback>
    </Avatar>
  );
};

export default SmartAvatar;
