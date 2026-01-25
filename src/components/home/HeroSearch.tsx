import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface HeroSearchProps {
  onSearch?: (filters: { location: string; date: Date | null; category: string }) => void;
}

// Algerian Wilayas for autocomplete
const ALGERIAN_CITIES = [
  'Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida',
  'Batna', 'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra',
  'Tébessa', 'El Oued', 'Skikda', 'Tiaret', 'Béjaïa',
  'Tlemcen', 'Béchar', 'Mostaganem', 'Bordj Bou Arréridj', 'Chlef',
  'Médéa', 'Tizi Ouzou', 'Jijel', 'Relizane', 'Saïda'
];

const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const filteredCities = ALGERIAN_CITIES.filter(city =>
    city.toLowerCase().includes(location.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchFilters = {
      location: location.trim(),
      date: selectedDate,
      category: ''
    };

    if (onSearch) {
      onSearch(searchFilters);
    } else {
      const params = new URLSearchParams();
      if (searchFilters.location) params.append('location', searchFilters.location);
      if (searchFilters.date) params.append('date', searchFilters.date.toISOString());
      
      navigate(`/venues?${params.toString()}`);
    }
  };

  const handleCitySelect = (city: string) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  return (
    <div 
      className="bg-white/95 dark:bg-card/95 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 animate-fade-in" 
      style={{ animationDelay: '0.4s' }}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location Input with Autocomplete */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
              <MapPin size={20} className="text-muted-foreground" />
            </div>
            <input 
              type="text"
              placeholder={t('hero.locationPlaceholder', 'City (e.g., Algiers, Oran)')}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(location.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full h-14 ps-12 pe-4 rounded-xl border border-champagne-200 dark:border-champagne-800 bg-white dark:bg-gray-900 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent transition-all"
            />
            
            {/* City Suggestions Dropdown */}
            {showSuggestions && filteredCities.length > 0 && (
              <div className="absolute top-full start-0 end-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-champagne-200 dark:border-champagne-800 z-50 overflow-hidden">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-start hover:bg-champagne-50 dark:hover:bg-champagne-900/50 transition-colors flex items-center gap-2"
                  >
                    <MapPin size={16} className="text-blush-400" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Date Picker */}
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-14 ps-12 justify-start text-start font-normal rounded-xl border-champagne-200 dark:border-champagne-800 bg-white dark:bg-gray-900 hover:bg-champagne-50 dark:hover:bg-champagne-900/50",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar size={20} className="absolute start-4 text-muted-foreground" />
                  {selectedDate ? format(selectedDate, "PPP") : t('hero.eventDate', 'Event Date')}
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
          
          {/* Search Button with pulse animation */}
          <div>
            <Button 
              type="submit" 
              size="lg"
              className="w-full h-14 rounded-xl bg-blush-500 hover:bg-blush-600 text-white font-semibold text-base shadow-lg shadow-blush-500/25 hover:shadow-xl hover:shadow-blush-500/30 transition-all"
              pulse
            >
              <Search size={20} className="me-2" />
              {t('hero.searchNow', 'Search Now')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSearch;
