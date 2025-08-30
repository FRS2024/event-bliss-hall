import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslatedToast } from '@/hooks/useTranslatedToast';
import { Users, Home } from 'lucide-react';

const RoleSelectionPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'guest' | 'host' | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUserRole } = useAuth();
  const { showSuccess, showError } = useTranslatedToast();
  const navigate = useNavigate();

  const handleRoleSelection = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    const { error } = await updateUserRole(selectedRole);
    
    if (error) {
      showError("errors.generic", error.message);
    } else {
      showSuccess("auth.roleUpdated", "Account type updated successfully!");
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-script text-3xl text-blush-500 dark:text-blush-400 mb-4">
              Choose Your Account Type
            </h1>
            <p className="text-muted-foreground">
              Select how you'd like to use EasyHall
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card 
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === 'guest' 
                  ? 'ring-2 ring-blush-400 bg-blush-50 dark:bg-blush-950' 
                  : 'hover:ring-1 hover:ring-blush-200'
              }`}
              onClick={() => setSelectedRole('guest')}
            >
              <div className="text-center">
                <Users className="w-12 h-12 text-blush-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Guest</h3>
                <p className="text-muted-foreground mb-4">
                  Book beautiful venues for your events and celebrations
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse and book venues</li>
                  <li>• Manage your bookings</li>
                  <li>• Message venue hosts</li>
                  <li>• Leave reviews</li>
                </ul>
              </div>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === 'host' 
                  ? 'ring-2 ring-blush-400 bg-blush-50 dark:bg-blush-950' 
                  : 'hover:ring-1 hover:ring-blush-200'
              }`}
              onClick={() => setSelectedRole('host')}
            >
              <div className="text-center">
                <Home className="w-12 h-12 text-blush-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Host</h3>
                <p className="text-muted-foreground mb-4">
                  List your venues and earn money by hosting events
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• List unlimited venues</li>
                  <li>• Manage bookings</li>
                  <li>• Set your own prices</li>
                  <li>• Communicate with guests</li>
                </ul>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={handleRoleSelection}
              disabled={!selectedRole || loading}
              className="bg-blush-400 hover:bg-blush-500 text-white px-8 py-3"
            >
              {loading ? 'Setting up account...' : 'Continue'}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              You can change this anytime in your settings
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RoleSelectionPage;