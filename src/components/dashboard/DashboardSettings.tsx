
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const DashboardSettings: React.FC = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile, isUpdating, error } = useProfile();
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      console.log('Setting form data from profile:', profile);
      setFormData({
        full_name: profile.full_name || '',
        business_name: profile.business_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-600">Error loading profile: {error.message}</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Form input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    console.log('Saving profile changes:', formData);
    
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleAvatarUpdate = (url: string | null) => {
    console.log('Avatar updated:', url);
    // Avatar update is handled in the AvatarUpload component
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and business preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatarUrl={profile?.avatar_url}
            userName={profile?.business_name || profile?.full_name || user?.email || ''}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </CardContent>
      </Card>

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
            <Label htmlFor="full_name">Full Name *</Label>
            <Input 
              id="full_name" 
              name="full_name"
              placeholder="Your full name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input 
              id="business_name" 
              name="business_name"
              placeholder="Your business name" 
              value={formData.business_name}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Contact Phone</Label>
            <Input 
              id="phone" 
              name="phone"
              placeholder="Your phone number" 
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Business Description</Label>
            <Textarea 
              id="bio" 
              name="bio"
              placeholder="Describe your business" 
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
