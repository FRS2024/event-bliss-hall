
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminBookings: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage bookings and disputes</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Booking Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Booking management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
