
import React from 'react';
import { Star } from 'lucide-react';

interface VenueShowcaseProps {
  isVisible: boolean;
}

const VenueShowcase: React.FC<VenueShowcaseProps> = ({ isVisible }) => {
  return (
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
  );
};

export default VenueShowcase;
