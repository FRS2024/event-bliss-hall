
import React from 'react';
import { Search, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SmartAvatar from '@/components/ui/smart-avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const MobileChatHeader: React.FC = () => {
  const { user } = useAuth();
  const userRole = useUserRole();

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      {/* Header with avatar and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <SmartAvatar
            src={user?.user_metadata?.avatar_url}
            alt={user?.email || 'User'}
            fallbackText={user?.email || 'U'}
            size="md"
          />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Chats</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
          <Edit3 size={20} />
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search for chats and messages" 
          className="pl-10 bg-gray-100 dark:bg-gray-800 border-0 rounded-full"
        />
      </div>
    </div>
  );
};

export default MobileChatHeader;
