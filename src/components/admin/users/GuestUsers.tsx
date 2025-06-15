
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GuestUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Users</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage event organizers and guests</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Guest Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Guest user management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestUsers;
