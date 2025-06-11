
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const DashboardSettings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: user?.user_metadata?.business_name || '',
    contactPhone: user?.user_metadata?.contact_phone || '',
    description: user?.user_metadata?.description || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Here you would typically update the user metadata in Supabase
      // For now, we'll just show a success message
      console.log('Saving settings:', formData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and business preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled />
          </div>
          
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input 
              id="businessName" 
              name="businessName"
              placeholder="Your business name" 
              value={formData.businessName}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input 
              id="contactPhone" 
              name="contactPhone"
              placeholder="Your phone number" 
              value={formData.contactPhone}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Business Description</Label>
            <Input 
              id="description" 
              name="description"
              placeholder="Describe your business" 
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
