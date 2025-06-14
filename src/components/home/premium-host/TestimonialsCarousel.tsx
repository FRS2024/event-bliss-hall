
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  venue: string;
  image: string;
  quote: string;
  rating: number;
  earnings: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Mitchell',
    venue: 'The Grand Ballroom',
    image: 'https://images.unsplash.com/photo-1494790108755-2616c88f0da9?w=100&h=100&fit=crop&crop=face',
    quote: 'EasyHall transformed my venue business. I\'ve tripled my bookings in just 6 months!',
    rating: 5,
    earnings: '$25,000'
  },
  {
    name: 'Michael Chen',
    venue: 'Garden Pavilion',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    quote: 'The platform is incredibly easy to use. Professional photos made all the difference.',
    rating: 5,
    earnings: '$18,500'
  },
  {
    name: 'Elena Rodriguez',
    venue: 'Coastal Events Center',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    quote: 'From zero bookings to fully booked weekends. This platform changed everything!',
    rating: 5,
    earnings: '$32,000'
  }
];

const TestimonialsCarousel: React.FC = () => {
  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <h3 className="font-serif text-xl font-semibold mb-4 text-center">Host Success Stories</h3>
      <Carousel className="w-full">
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index}>
              <div className="text-center space-y-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                />
                <blockquote className="text-lg italic text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.venue}</div>
                  <div className="text-sm font-semibold text-green-600">Earned {testimonial.earnings}</div>
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
