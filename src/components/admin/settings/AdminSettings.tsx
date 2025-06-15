
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage admin users and platform settings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Admin settings interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
