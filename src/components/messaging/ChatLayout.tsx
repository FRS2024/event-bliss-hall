
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import MessageThread from './MessageThread';
import ChatWelcome from './ChatWelcome';

const ChatLayout: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-200px)] bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <ChatSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route index element={<ChatWelcome />} />
          <Route path=":conversationId" element={<MessageThread />} />
        </Routes>
      </div>
    </div>
  );
};

export default ChatLayout;
