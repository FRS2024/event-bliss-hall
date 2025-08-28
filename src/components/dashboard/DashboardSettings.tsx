
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AvatarUpload from '@/components/profile/AvatarUpload';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const DashboardSettings: React.FC = () => {
  const { user, updatePassword, updateEmail, updatePhone } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile, isUpdating, error } = useProfile();
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    phone: '',
    bio: '',
  });

  // Security forms state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });
  const [phoneForm, setPhoneForm] = useState({
    phoneNumber: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    emailPassword: false
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

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

  const handlePasswordUpdate = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (error) {
        toast.error(error.message || 'Failed to update password');
      } else {
        toast.success('Password updated successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!emailForm.newEmail || !emailForm.password) {
      toast.error('Email and password are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const { error } = await updateEmail(emailForm.newEmail, emailForm.password);
      if (error) {
        toast.error(error.message || 'Failed to update email');
      } else {
        toast.success('Email update confirmation sent. Please check your new email to confirm the change.');
        setEmailForm({ newEmail: '', password: '' });
      }
    } catch (error) {
      toast.error('Failed to update email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePhoneUpdate = async () => {
    if (!phoneForm.phoneNumber) {
      toast.error('Phone number is required');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      const { error } = await updatePhone(phoneForm.phoneNumber);
      if (error) {
        toast.error(error.message || 'Failed to update phone number');
      } else {
        toast.success('Phone number updated successfully');
        setPhoneForm({ phoneNumber: '' });
      }
    } catch (error) {
      toast.error('Failed to update phone number');
    } finally {
      setIsUpdatingPhone(false);
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

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Change Password</h3>
            <div className="grid gap-4">
              <div className="relative">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="currentPassword" 
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password (min 8 characters)"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button onClick={handlePasswordUpdate} disabled={isUpdatingPassword} className="w-fit">
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Change Email Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Change Email</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="currentEmail">Current Email</Label>
                <Input id="currentEmail" value={user?.email || ''} disabled />
              </div>
              
              <div>
                <Label htmlFor="newEmail">New Email</Label>
                <Input 
                  id="newEmail" 
                  type="email"
                  placeholder="Enter new email address"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
                />
              </div>
              
              <div className="relative">
                <Label htmlFor="emailPassword">Confirm with Password</Label>
                <div className="relative">
                  <Input 
                    id="emailPassword" 
                    type={showPasswords.emailPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ ...prev, emailPassword: !prev.emailPassword }))}
                  >
                    {showPasswords.emailPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleEmailUpdate} disabled={isUpdatingEmail} className="w-fit">
                {isUpdatingEmail ? 'Updating...' : 'Update Email'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Update Phone Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Update Authentication Phone</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="currentAuthPhone">Current Auth Phone</Label>
                <Input id="currentAuthPhone" value={user?.phone || 'Not set'} disabled />
              </div>
              
              <div>
                <Label htmlFor="newPhoneNumber">New Phone Number</Label>
                <Input 
                  id="newPhoneNumber" 
                  type="tel"
                  placeholder="Enter new phone number"
                  value={phoneForm.phoneNumber}
                  onChange={(e) => setPhoneForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
              
              <Button onClick={handlePhoneUpdate} disabled={isUpdatingPhone} className="w-fit">
                {isUpdatingPhone ? 'Updating...' : 'Update Phone Number'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
