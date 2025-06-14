
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, DollarSign, Award } from 'lucide-react';

const HostCTAForm: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
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
  );
};

export default HostCTAForm;
