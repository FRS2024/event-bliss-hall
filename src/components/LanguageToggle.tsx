
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇩🇿' },
];

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-foreground min-h-[44px] px-3 touch-manipulation font-medium text-sm hover:bg-blush-50 dark:hover:bg-blush-900/20"
          aria-label="Change language"
        >
          <div className="flex items-center space-x-1">
            <span className="font-medium text-sm">
              {currentLanguage.code.toUpperCase()}
            </span>
            <ChevronDownIcon className="h-3 w-3 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-gray-900 border border-champagne-200 dark:border-champagne-800 rounded-lg shadow-lg z-50"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center space-x-3 px-3 py-2 text-sm cursor-pointer hover:bg-blush-50 dark:hover:bg-blush-900/20 ${
              currentLanguage.code === language.code 
                ? 'bg-blush-50 dark:bg-blush-900/20 text-blush-600 dark:text-blush-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.name}</span>
              <span className="text-xs opacity-60">{language.nativeName}</span>
            </div>
            {currentLanguage.code === language.code && (
              <div className="ml-auto w-2 h-2 rounded-full bg-blush-500"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
