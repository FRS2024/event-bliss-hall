import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Camera, Grid3X3 } from 'lucide-react';
import { useImageGallery } from '@/hooks/useImageGallery';
import VenueImageLightbox from './VenueImageLightbox';
import { cn } from '@/lib/utils';

interface VenueImageGalleryProps {
  images: string[];
  venueName?: string;
  className?: string;
}

const VenueImageGallery: React.FC<VenueImageGalleryProps> = ({
  images,
  venueName = 'Venue',
  className,
}) => {
  const gallery = useImageGallery({ images });

  if (!images || images.length === 0) {
    return (
      <div className={cn("aspect-video bg-muted rounded-xl flex items-center justify-center", className)}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  // Bento grid layout for multiple images
  const renderBentoGrid = () => {
    const displayImages = images.slice(0, 5);
    const remainingCount = images.length - 5;

    if (images.length === 1) {
      return (
        <div 
          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => gallery.openLightbox(0)}
        >
          <img
            src={images[0]}
            alt={venueName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[480px] rounded-xl overflow-hidden">
        {/* Main large image */}
        <div 
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => gallery.openLightbox(0)}
        >
          <img
            src={displayImages[0]}
            alt={`${venueName} - Main`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Secondary images */}
        {displayImages.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative cursor-pointer group overflow-hidden"
            onClick={() => gallery.openLightbox(index + 1)}
          >
            <img
              src={image}
              alt={`${venueName} - ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            
            {/* Show remaining count on last image */}
            {index === 3 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-serif text-2xl">+{remainingCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      {/* Bento Grid */}
      {renderBentoGrid()}

      {/* Navigation Overlay - Shows on hover */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            gallery.goPrev();
          }}
          disabled={!gallery.canGoPrev}
          className={cn(
            "pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 z-20",
            "w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-lg",
            "text-foreground hover:bg-blush-50 hover:text-blush-600",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "disabled:opacity-0"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            gallery.goNext();
          }}
          disabled={!gallery.canGoNext}
          className={cn(
            "pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 z-20",
            "w-10 h-10 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-lg",
            "text-foreground hover:bg-blush-50 hover:text-blush-600",
            "opacity-0 group-hover:opacity-100 transition-all duration-300",
            "disabled:opacity-0"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Image Counter Badge */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
        <Camera className="h-4 w-4 text-white" />
        <span className="text-white text-sm font-medium">{images.length}</span>
      </div>

      {/* Show All Photos Button */}
      <Button
        onClick={() => gallery.openLightbox(0)}
        className={cn(
          "absolute bottom-4 right-4 z-10",
          "bg-white/90 dark:bg-black/70 backdrop-blur-sm text-foreground",
          "hover:bg-white dark:hover:bg-black/90 shadow-lg",
          "border border-border/50"
        )}
        size="sm"
      >
        <Grid3X3 className="h-4 w-4 mr-2" />
        Show all photos
      </Button>

      {/* Lightbox */}
      <VenueImageLightbox
        images={images}
        currentIndex={gallery.currentIndex}
        isOpen={gallery.isLightboxOpen}
        onClose={gallery.closeLightbox}
        onNext={gallery.goNext}
        onPrev={gallery.goPrev}
        onIndexChange={gallery.setCurrentIndex}
        canGoNext={gallery.canGoNext}
        canGoPrev={gallery.canGoPrev}
        venueName={venueName}
      />
    </div>
  );
};

export default VenueImageGallery;
