
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HeroSearchProps {
  onSearch?: (filters: { location: string; date: Date | null; category: string }) => void;
}

const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchFilters = {
      location: location.trim(),
      date: selectedDate,
      category: category.trim()
    };

    if (onSearch) {
      onSearch(searchFilters);
    } else {
      // Navigate to venues page with search parameters
      const params = new URLSearchParams();
      if (searchFilters.location) params.append('location', searchFilters.location);
      if (searchFilters.date) params.append('date', searchFilters.date.toISOString());
      if (searchFilters.category) params.append('category', searchFilters.category);
      
      navigate(`/venues?${params.toString()}`);
    }
  };

  return (
    <div className="bg-white dark:bg-card p-4 md:p-6 rounded-lg shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={20} className="text-muted-foreground" />
            </div>
            <input 
              type="text"
              placeholder={t('filters.location')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="elegant-input pl-10"
            />
          </div>
          
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "elegant-input pl-10 justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar size={20} className="absolute left-3 text-muted-foreground" />
                  {selectedDate ? format(selectedDate, "PPP") : t('booking.eventDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => setSelectedDate(date || null)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full bg-blush-400 hover:bg-blush-500 text-white"
            >
              <Search size={20} className="mr-2" />
              {t('venues.viewDetails')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSearch;
