import React, { useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Share2, Heart, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VenueImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onIndexChange: (index: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  venueName?: string;
}

const VenueImageLightbox: React.FC<VenueImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onIndexChange,
  canGoNext,
  canGoPrev,
  venueName = 'Venue',
}) => {
  const [isLiked, setIsLiked] = React.useState(false);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowRight':
        if (canGoNext) onNext();
        break;
      case 'ArrowLeft':
        if (canGoPrev) onPrev();
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [isOpen, canGoNext, canGoPrev, onNext, onPrev, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 bg-black/95 border-none rounded-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10 hover:text-white gap-2"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">Close</span>
          </Button>

          <div className="font-serif text-white/90 text-lg tracking-wide">
            <span className="text-blush-300">{currentIndex + 1}</span>
            <span className="mx-2 text-white/50">/</span>
            <span>{images.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-blush-400 text-blush-400")} />
            </Button>
          </div>
        </div>

        {/* Main Image Container */}
        <div className="relative flex items-center justify-center w-full h-full px-16">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            disabled={!canGoPrev}
            className={cn(
              "absolute left-4 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20",
              "text-white hover:bg-blush-400/30 hover:border-blush-400/50 hover:shadow-[0_0_20px_rgba(244,177,186,0.3)]",
              "transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/10"
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Image */}
          <div className="relative max-w-[85vw] max-h-[80vh] animate-fade-in">
            <img
              src={images[currentIndex] || '/placeholder.svg'}
              alt={`${venueName} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!canGoNext}
            className={cn(
              "absolute right-4 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20",
              "text-white hover:bg-blush-400/30 hover:border-blush-400/50 hover:shadow-[0_0_20px_rgba(244,177,186,0.3)]",
              "transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/10"
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-0 left-0 right-0 z-50 py-4 px-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onIndexChange(index)}
                className={cn(
                  "relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-300",
                  "border-2 hover:scale-105",
                  index === currentIndex 
                    ? "border-champagne-400 ring-2 ring-champagne-400/50 scale-105" 
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueImageLightbox;
