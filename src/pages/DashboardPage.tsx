
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { SidebarProvider } from '@/components/ui/sidebar';

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <div className="flex-1">
            <DashboardContent />
          </div>
        </div>
      </SidebarProvider>
    </MainLayout>
  );
};

export default DashboardPage;
