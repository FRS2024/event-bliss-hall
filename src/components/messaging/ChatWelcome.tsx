
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

const ChatWelcome: React.FC = () => {
  const userRole = useUserRole();

  return (
    <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
      <div className="text-center p-8">
        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome to Messages
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {userRole === 'host' 
            ? "Select a conversation from the sidebar to start communicating with your guests about venue inquiries and bookings."
            : "Select a conversation from the sidebar to chat with hosts about venues you're interested in."
          }
        </p>
      </div>
    </div>
  );
};

export default ChatWelcome;
