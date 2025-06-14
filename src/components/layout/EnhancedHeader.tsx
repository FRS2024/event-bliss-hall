
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Heart, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import UserDropdown from '@/components/UserDropdown';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';

const EnhancedHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.venues'), href: '/venues' },
    { name: t('nav.categories'), href: '/categories' },
    { name: t('nav.howItWorks'), href: '/how-it-works' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 border-b border-gray-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="container-modern">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blush-500 to-champagne-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}>
              EasyHall
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                  isActive(item.href)
                    ? isScrolled 
                      ? 'text-blush-600' 
                      : 'text-white'
                    : isScrolled 
                      ? 'text-gray-700 hover:text-blush-600' 
                      : 'text-white/90 hover:text-white'
                } after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-current after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  isActive(item.href) ? 'after:scale-x-100' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard/bookings">
                  <EnhancedButton variant="ghost" size="icon" className={isScrolled ? '' : 'text-white hover:bg-white/20'}>
                    <Calendar size={20} />
                  </EnhancedButton>
                </Link>
                <Link to="/messages">
                  <EnhancedButton variant="ghost" size="icon" className={isScrolled ? '' : 'text-white hover:bg-white/20'}>
                    <MessageSquare size={20} />
                  </EnhancedButton>
                </Link>
                <UserDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <EnhancedButton 
                    variant="ghost" 
                    className={isScrolled ? '' : 'text-white hover:bg-white/20 border-white/30'}
                  >
                    {t('auth.login')}
                  </EnhancedButton>
                </Link>
                <Link to="/signup">
                  <EnhancedButton variant="premium" size="default">
                    {t('auth.signup')}
                  </EnhancedButton>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 py-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-blush-50 text-blush-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              
              {user ? (
                <div className="space-y-3">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <EnhancedButton variant="outline" fullWidth={true}>
                      <User size={18} />
                      Dashboard
                    </EnhancedButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <EnhancedButton variant="outline" fullWidth={true}>
                      {t('auth.login')}
                    </EnhancedButton>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <EnhancedButton variant="default" fullWidth={true}>
                      {t('auth.signup')}
                    </EnhancedButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
