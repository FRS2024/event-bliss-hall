
import React from 'react';
import MessagesList from '../messaging/MessagesList';

const MessagesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Communication with your guests</p>
      </div>

      <MessagesList />
    </div>
  );
};

export default MessagesView;
