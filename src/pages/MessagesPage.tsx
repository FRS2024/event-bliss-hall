
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MobileChatLayout from '@/components/messaging/MobileChatLayout';

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
      <div className="h-screen flex flex-col">
        <MobileChatLayout />
      </div>
    </MainLayout>
  );
};

export default MessagesPage;
