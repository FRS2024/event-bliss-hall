import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startOnMount?: boolean;
  easing?: 'linear' | 'easeOut' | 'easeInOut';
}

export function useCountUp(
  targetNumber: number,
  shouldStart: boolean = false,
  options: UseCountUpOptions = {}
): number {
  const { duration = 2000, easing = 'easeOut' } = options;
  
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setCount(targetNumber);
      return;
    }

    const easingFunctions = {
      linear: (t: number) => t,
      easeOut: (t: number) => 1 - Math.pow(1 - t, 4),
      easeInOut: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = easingFunctions[easing](progress);
      setCount(Math.floor(easedProgress * targetNumber));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetNumber, duration, shouldStart, easing]);

  return count;
}

export default useCountUp;
