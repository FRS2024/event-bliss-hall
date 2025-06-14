
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SmartAvatar from '@/components/ui/smart-avatar';
import LanguageToggle from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const MobileChatHeader: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      {/* Header with avatar, title and language toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <SmartAvatar
            src={user?.user_metadata?.avatar_url}
            alt={user?.email || 'User'}
            fallbackText={user?.email || 'U'}
            size="md"
          />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t('chat.title')}</h1>
        </div>
        <LanguageToggle />
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder={t('chat.search')}
          className="pl-10 bg-gray-100 dark:bg-gray-800 border-0 rounded-full"
        />
      </div>
    </div>
  );
};

export default MobileChatHeader;
