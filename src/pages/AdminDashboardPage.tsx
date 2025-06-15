
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminContent from '@/components/admin/AdminContent';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, error } = useAdminAuth();

  console.log('🎯 AdminDashboardPage render:', { 
    user: user?.email, 
    isAdmin, 
    authLoading, 
    adminLoading, 
    error 
  });

  // Show loading while checking authentication
  if (authLoading || adminLoading) {
    console.log('⏳ Loading admin dashboard...');
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </MainLayout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🚪 No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Show error if there was an issue checking admin status
  if (error) {
    console.error('💥 Admin auth error:', error);
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
              <p className="text-sm text-gray-500 mt-2">
                Error: {error.message}
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Redirect if user is not an admin
  if (!isAdmin) {
    console.log('🚫 User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Rendering admin dashboard for user:', user.email);

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
