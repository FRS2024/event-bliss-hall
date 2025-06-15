
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HostUsers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Host Users</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage venue owners and hosts</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Host Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Host user management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostUsers;
