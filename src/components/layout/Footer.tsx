
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollLink from '@/components/ui/ScrollLink';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white dark:bg-card border-t border-champagne-100 dark:border-champagne-900/40 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-3xl text-blush-500 dark:text-blush-400">EasyHall</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink to="/venues" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.allVenues')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('nav.categories')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/how-it-works" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('nav.howItWorks')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/contact" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('nav.contact')}
                </ScrollLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">{t('footer.eventTypes')}</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink to="/categories/wedding" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.weddings')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories/birthday" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.birthdays')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories/corporate" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.corporateEvents')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/categories/other" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.specialOccasions')}
                </ScrollLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink to="/terms" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.termsOfService')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/privacy" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.privacyPolicy')}
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="/cookies" className="text-muted-foreground hover:text-blush-500 dark:hover:text-blush-400 transition-colors">
                  {t('footer.cookiePolicy')}
                </ScrollLink>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-champagne-100 dark:border-champagne-900/40 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EasyHall. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
