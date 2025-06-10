
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DashboardSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" placeholder="Your business name" />
          </div>
          
          <div>
            <Label htmlFor="contact-phone">Contact Phone</Label>
            <Input id="contact-phone" placeholder="Your phone number" />
          </div>
          
          <div>
            <Label htmlFor="description">Business Description</Label>
            <Input id="description" placeholder="Describe your business" />
          </div>
          
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
