import { useState, useEffect, useRef, RefObject } from 'react';

interface UseLazyLoadOptions {
  /** Root margin for intersection observer (default: '200px' - preload slightly before visible) */
  rootMargin?: string;
  /** Visibility threshold (default: 0) */
  threshold?: number;
  /** Force eager loading (for above-the-fold content) */
  forceEager?: boolean;
}

interface UseLazyLoadReturn {
  ref: RefObject<HTMLDivElement>;
  isVisible: boolean;
  hasLoaded: boolean;
  loadingStrategy: 'eager' | 'lazy';
}

/**
 * Hook for optimized lazy loading with Intersection Observer.
 * Detects if element is above-the-fold and sets appropriate loading strategy.
 */
export const useLazyLoad = (options: UseLazyLoadOptions = {}): UseLazyLoadReturn => {
  const { 
    rootMargin = '200px', 
    threshold = 0,
    forceEager = false 
  } = options;
  
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(forceEager);
  const [hasLoaded, setHasLoaded] = useState(forceEager);
  const [isAboveFold, setIsAboveFold] = useState(false);

  useEffect(() => {
    // Check if element is above the fold on mount
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Consider above-fold if top of element is within viewport
      if (rect.top < viewportHeight) {
        setIsAboveFold(true);
        setIsVisible(true);
        setHasLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (forceEager || isAboveFold || hasLoaded) return;

    const element = ref.current;
    if (!element) return;

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasLoaded(true);
            observer.unobserve(element);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, forceEager, isAboveFold, hasLoaded]);

  // Determine loading strategy: eager for above-fold, lazy for below
  const loadingStrategy = isAboveFold || forceEager ? 'eager' : 'lazy';

  return { ref, isVisible, hasLoaded, loadingStrategy };
};

export default useLazyLoad;
