
import React from 'react';
import MessagesList from '../messaging/MessagesList';
import { useUserRole } from '@/hooks/useUserRole';

const MessagesView: React.FC = () => {
  const userRole = useUserRole();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {userRole === 'host' 
            ? "Communication with your guests"
            : "Your conversations with hosts"
          }
        </p>
      </div>

      <MessagesList />
    </div>
  );
};

export default MessagesView;
