
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };
  
  return (
    <header className="bg-white dark:bg-card border-b border-champagne-100 dark:border-champagne-900/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-display text-3xl text-blush-500 dark:text-blush-400">EasyHall</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/venues" className="text-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
              Venues
            </Link>
            <Link to="/categories" className="text-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
              Categories
            </Link>
            <Link to="/how-it-works" className="text-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
              How It Works
            </Link>
            <Link to="/contact" className="text-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Search size={20} />
            </Button>
            <ThemeToggle />
            {user ? (
              <UserDropdown onSignOut={handleSignOut} />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-blush-200 text-blush-500 hover:bg-blush-50 dark:border-blush-800 dark:text-blush-400 dark:hover:bg-blush-900/20">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-blush-400 hover:bg-blush-500 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden p-4 bg-white dark:bg-card animate-slide-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/venues" 
              className="px-4 py-2 rounded-md hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Venues
            </Link>
            <Link 
              to="/categories" 
              className="px-4 py-2 rounded-md hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="/how-it-works" 
              className="px-4 py-2 rounded-md hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/contact" 
              className="px-4 py-2 rounded-md hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-champagne-100 dark:border-champagne-900/40 flex flex-col space-y-2">
              {user ? (
                <>
                  <span className="px-4 py-2 text-sm text-muted-foreground">Welcome, {user.email}</span>
                  <Link to="/settings" className="px-4 py-2 rounded-md hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors" onClick={() => setIsOpen(false)}>
                    My Settings
                  </Link>
                  <Link to="/my-bookings" className="px-4 py-2 rounded-md hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors" onClick={() => setIsOpen(false)}>
                    My Bookings
                  </Link>
                  <Link to="/dashboard" className="px-4 py-2 rounded-md hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors" onClick={() => setIsOpen(false)}>
                    My Dashboard
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full border-blush-200 text-blush-500 dark:border-blush-800 dark:text-blush-400"
                    onClick={handleSignOut}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-blush-200 text-blush-500 dark:border-blush-800 dark:text-blush-400">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-blush-400 hover:bg-blush-500 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
