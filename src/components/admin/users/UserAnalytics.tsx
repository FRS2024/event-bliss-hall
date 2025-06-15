
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze user behavior and trends</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">User analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;
