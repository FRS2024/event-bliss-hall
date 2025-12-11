import { useState, useCallback } from 'react';

interface UseImageGalleryProps {
  images: string[];
  initialIndex?: number;
}

interface UseImageGalleryReturn {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLightboxOpen: boolean;
  openLightbox: (index?: number) => void;
  closeLightbox: () => void;
  totalImages: number;
}

export const useImageGallery = ({ 
  images, 
  initialIndex = 0 
}: UseImageGalleryProps): UseImageGalleryReturn => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const totalImages = images.length;
  const canGoNext = currentIndex < totalImages - 1;
  const canGoPrev = currentIndex > 0;

  const goNext = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [canGoPrev]);

  const openLightbox = useCallback((index?: number) => {
    if (index !== undefined) {
      setCurrentIndex(index);
    }
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  return {
    currentIndex,
    setCurrentIndex,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
    isLightboxOpen,
    openLightbox,
    closeLightbox,
    totalImages,
  };
};
