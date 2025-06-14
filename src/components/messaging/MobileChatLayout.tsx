
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileChatHeader from './MobileChatHeader';
import MobileChatList from './MobileChatList';
import MessageThread from './MessageThread';

const MobileChatLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <Routes>
        <Route index element={
          <>
            <MobileChatHeader />
            <div className="flex-1 overflow-y-auto">
              <MobileChatList />
            </div>
          </>
        } />
        <Route path=":conversationId" element={<MessageThread />} />
      </Routes>
    </div>
  );
};

export default MobileChatLayout;
