
import React, { useState, useEffect } from 'react';

interface Stat {
  number: string;
  label: string;
}

const stats: Stat[] = [
  { number: '10,000+', label: 'Happy Hosts' },
  { number: '50,000+', label: 'Bookings Made' },
  { number: '98%', label: 'Host Satisfaction' },
  { number: '$2.5M+', label: 'Host Earnings' }
];

const StatsBar: React.FC = () => {
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg">
        <div className="text-center animate-fade-in" key={currentStat}>
          <div className="font-display text-2xl text-blush-600 dark:text-blush-400">{stats[currentStat].number}</div>
          <div className="text-sm text-muted-foreground">{stats[currentStat].label}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
