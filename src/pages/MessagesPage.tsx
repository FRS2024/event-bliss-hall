
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MessagesList from '@/components/messaging/MessagesList';

const MessagesPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Messages</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage your conversations</p>
          </div>

          <MessagesList />
        </div>
      </div>
    </MainLayout>
  );
};

export default MessagesPage;
