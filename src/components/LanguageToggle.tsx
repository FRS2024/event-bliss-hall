
import React from 'react';
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

  const displayLanguage = currentLanguage === 'en' ? 'EN' : 'FR';
  const nextLanguage = currentLanguage === 'en' ? 'Français' : 'English';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={`Switch to ${currentLanguage === 'en' ? 'French' : 'English'}`}
      className="rounded-full text-foreground min-h-[44px] min-w-[44px] touch-manipulation font-medium text-sm px-3"
      title={`Switch to ${nextLanguage}`}
    >
      {displayLanguage}
      <span className="sr-only">
        {currentLanguage === 'en' ? 'Passer au français' : 'Switch to English'}
      </span>
    </Button>
  );
};

export default LanguageToggle;
