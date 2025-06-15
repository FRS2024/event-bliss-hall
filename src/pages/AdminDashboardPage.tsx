
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminContent from '@/components/admin/AdminContent';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isLoading, error } = useAdminAuth();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Access Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Unable to verify admin access. Please contact support if you believe this is an error.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <AdminSidebar />
          <div className="flex-1">
            <AdminContent />
          </div>
        </div>
      </SidebarProvider>
    </MainLayout>
  );
};

export default AdminDashboardPage;
