import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface RTLProviderProps {
  children: React.ReactNode;
}

const RTLProvider: React.FC<RTLProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Add/remove RTL class for conditional styling
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [i18n.language]);

  return <>{children}</>;
};

export default RTLProvider;