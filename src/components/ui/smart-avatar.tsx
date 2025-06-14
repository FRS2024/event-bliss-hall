
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

  // Debug logging
  React.useEffect(() => {
    console.log('🎨 SmartAvatar - src:', src);
    console.log('🎨 SmartAvatar - fallbackText:', fallbackText);
    console.log('🎨 SmartAvatar - imageError:', imageError);
    console.log('🎨 SmartAvatar - imageLoaded:', imageLoaded);
  }, [src, fallbackText, imageError, imageLoaded]);

  // Reset error state when src changes
  React.useEffect(() => {
    if (src) {
      setImageError(false);
      setImageLoaded(false);
    }
  }, [src]);

  const handleImageError = () => {
    console.log('❌ SmartAvatar - Image failed to load:', src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ SmartAvatar - Image loaded successfully:', src);
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && !imageError && (
        <AvatarImage 
          src={src} 
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
        {getInitials(fallbackText)}
      </AvatarFallback>
    </Avatar>
  );
};

export default SmartAvatar;
