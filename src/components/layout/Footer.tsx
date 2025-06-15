
import React from 'react';
import { Link } from 'react-router-dom';
import ScrollLink from '@/components/ui/ScrollLink';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-card border-t border-champagne-100 dark:border-champagne-900/40 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-3xl text-blush-500 dark:text-blush-400">EasyHall</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Find the perfect venue for your special day. From weddings to corporate events, we have the ideal space for your celebration.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink to="/venues" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  All Venues
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Categories
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/how-it-works" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  How It Works
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/contact" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Contact Us
                </ScrollLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Event Types</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink to="/categories/wedding" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Weddings
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories/birthday" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Birthdays
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories/corporate" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Corporate Events
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories/other" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Special Occasions
                </ScrollLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink to="/terms" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Terms of Service
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/privacy" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Privacy Policy
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/cookies" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Cookie Policy
                </ScrollLink>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-champagne-100 dark:border-champagne-900/40 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EasyHall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
