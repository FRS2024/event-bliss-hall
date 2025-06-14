
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, Calendar, LayoutDashboard, LogOut, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useProfile } from '@/hooks/useProfile';
import SmartAvatar from '@/components/ui/smart-avatar';

interface UserDropdownProps {
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onSignOut }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const userRole = useUserRole();
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // Debug logging
  React.useEffect(() => {
    console.log('🎭 UserDropdown - Profile data:', profile);
    console.log('🖼️ UserDropdown - Avatar URL:', profile?.avatar_url);
    console.log('👤 UserDropdown - User:', user?.email);
    console.log('⏳ UserDropdown - Profile loading:', profileLoading);
  }, [profile, user, profileLoading]);

  const handleSignOut = () => {
    onSignOut();
    navigate('/');
  };

  // Show loading state while determining user role or loading profile
  if (userRole === 'loading' || profileLoading) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <SmartAvatar
          fallbackText={user?.email || ''}
          size="md"
        />
      </Button>
    );
  }

  const displayName = profile?.business_name || profile?.full_name || user?.email || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <SmartAvatar
            src={profile?.avatar_url}
            alt={displayName}
            fallbackText={displayName}
            size="md"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            {profile?.avatar_url && (
              <p className="text-xs leading-none text-muted-foreground opacity-60">
                Avatar: {profile.avatar_url.slice(-20)}...
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('nav.mySettings')}</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/dashboard/bookings" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{t('nav.myBookings')}</span>
          </Link>
        </DropdownMenuItem>
        
        {userRole === 'host' ? (
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{t('nav.myDashboard')}</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/dashboard/messages" className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>{t('nav.messages')}</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('nav.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
