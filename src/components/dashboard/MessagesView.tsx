
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const MessagesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400">Communication with your guests</p>
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-gray-600">Messages from guests will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesView;
