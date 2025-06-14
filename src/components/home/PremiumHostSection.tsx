
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Users, Calendar, Camera, Star, TrendingUp, Shield, DollarSign, Award } from 'lucide-react';

const PremiumHostSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: '10,000+', label: 'Happy Hosts' },
    { number: '50,000+', label: 'Bookings Made' },
    { number: '98%', label: 'Host Satisfaction' },
    { number: '$2.5M+', label: 'Host Earnings' }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Reach More Clients',
      description: 'Connect with thousands of event planners actively searching for the perfect venue',
      gradient: 'from-blush-400 to-blush-600'
    },
    {
      icon: Calendar,
      title: 'Smart Booking Management',
      description: 'Automated scheduling, instant notifications, and seamless calendar integration',
      gradient: 'from-champagne-400 to-champagne-600'
    },
    {
      icon: Camera,
      title: 'Professional Photography',
      description: 'Free professional photo shoots to showcase your venue at its absolute best',
      gradient: 'from-gold-400 to-gold-600'
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Build trust with authentic reviews from verified guests and event hosts',
      gradient: 'from-blush-500 to-champagne-500'
    }
  ];

  const testimonials = [
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('host-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission logic here
    console.log('Email submitted:', email);
  };

  return (
    <section id="host-section" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blush-50 via-champagne-50 to-gold-50 dark:from-blush-950 dark:via-champagne-950 dark:to-gold-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blush-200/30 to-champagne-200/30 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-champagne-200/30 to-gold-200/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Stats Bar */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg">
            <div className="text-center animate-fade-in" key={currentStat}>
              <div className="font-display text-2xl text-blush-600 dark:text-blush-400">{stats[currentStat].number}</div>
              <div className="text-sm text-muted-foreground">{stats[currentStat].label}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blush-100 to-champagne-100 dark:from-blush-900/50 dark:to-champagne-900/50 rounded-full px-4 py-2">
                <TrendingUp className="w-4 h-4 text-blush-600 dark:text-blush-400" />
                <span className="text-sm font-medium text-blush-700 dark:text-blush-300">Join 10,000+ Successful Hosts</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blush-600 via-champagne-600 to-gold-600 bg-clip-text text-transparent leading-tight">
                Transform Your Space Into Profit
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Join the most trusted platform for venue hosts. Turn your beautiful space into a thriving business with our premium tools, professional support, and guaranteed bookings.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className={`group p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-blush-600 dark:group-hover:text-blush-400 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Enhanced CTA Section */}
            <div className="space-y-6 p-8 bg-gradient-to-r from-white/80 to-champagne-50/80 dark:from-gray-900/80 dark:to-champagne-950/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
              <div className="text-center space-y-2">
                <h3 className="font-serif text-2xl font-semibold">Ready to Start Earning?</h3>
                <p className="text-muted-foreground">Join today and get your first booking within 30 days, guaranteed.</p>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email to get started"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg"
                  required
                />
                <Button
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-r from-blush-500 to-champagne-500 hover:from-blush-600 hover:to-champagne-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Become a Host
                </Button>
              </form>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span>Earn from day one</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            {/* Main Image with Glassmorphism Effect */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blush-500/20 to-champagne-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2968&q=80" 
                  alt="Luxury venue interior" 
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">The Grand Ballroom</div>
                        <div className="text-sm text-muted-foreground">Earned $25,000 this month</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Carousel */}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHostSection;
