
import React from 'react';
import { Link } from 'react-router-dom';

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
                <Link to="/venues" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  All Venues
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Event Types</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/wedding" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Weddings
                </Link>
              </li>
              <li>
                <Link to="/categories/birthday" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Birthdays
                </Link>
              </li>
              <li>
                <Link to="/categories/corporate" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Corporate Events
                </Link>
              </li>
              <li>
                <Link to="/categories/other" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Special Occasions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  Cookie Policy
                </Link>
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
