
import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={`Switch to ${currentLanguage === 'en' ? 'French' : 'English'}`}
      className="rounded-full text-foreground min-h-[44px] min-w-[44px] touch-manipulation"
      title={`${currentLanguage === 'en' ? 'Français' : 'English'}`}
    >
      <Languages size={20} />
      <span className="sr-only">
        {currentLanguage === 'en' ? 'Passer au français' : 'Switch to English'}
      </span>
    </Button>
  );
};

export default LanguageToggle;
