
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';

const MyBookingsPage: React.FC = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage your venue bookings</p>
          </div>

          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
              <p className="text-gray-600">Your bookings will appear here once you make a reservation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyBookingsPage;
