
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { useProfile } from '@/hooks/useProfile';

const SettingsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile, isUpdating } = useProfile();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  if (loading || profileLoading) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
  };

  const handleAvatarUpdate = (url: string | null) => {
    // Avatar update is handled in the AvatarUpload component
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account settings</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                currentAvatarUrl={profile?.avatar_url}
                userName={profile?.full_name || user.email || ''}
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
                <Input id="email" value={user.email || ''} disabled />
              </div>
              
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name" 
                  name="full_name"
                  placeholder="Your full name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  placeholder="Tell us about yourself"
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
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
