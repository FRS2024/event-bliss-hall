
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Skeleton } from '@/components/ui/skeleton';

interface FallbackTestimonial {
  name: string;
  venue_name: string;
  avatar_url: string;
  quote: string;
  rating: number;
}

const fallbackTestimonials: FallbackTestimonial[] = [
  {
    name: 'Michael Chen',
    venue_name: 'Garden Pavilion',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    quote: 'The platform is incredibly easy to use. Professional photos made all the difference.',
    rating: 5
  },
  {
    name: 'Elena Rodriguez',
    venue_name: 'Coastal Events Center',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    quote: 'From zero bookings to fully booked weekends. This platform changed everything!',
    rating: 5
  }
];

const TestimonialsCarousel: React.FC = () => {
  const { data: dbTestimonials, isLoading } = useTestimonials();
  
  // Use database testimonials if available, otherwise use fallback
  const testimonials = dbTestimonials && dbTestimonials.length > 0 
    ? dbTestimonials 
    : fallbackTestimonials;

  if (isLoading) {
    return (
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h3 className="font-serif text-xl font-semibold mb-4 text-center">Host Success Stories</h3>
        <div className="text-center space-y-4">
          <Skeleton className="w-16 h-16 rounded-full mx-auto" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <h3 className="font-serif text-xl font-semibold mb-4 text-center">Host Success Stories</h3>
      <Carousel className="w-full">
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={testimonial.name + index}>
              <div className="text-center space-y-4">
                <img
                  src={testimonial.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
                <blockquote className="text-lg italic text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.venue_name}</div>
                </div>
                <div className="flex justify-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default TestimonialsCarousel;
