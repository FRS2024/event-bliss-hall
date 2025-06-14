
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, Calendar, LayoutDashboard, LogOut, MessageCircle } from 'lucide-react';
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
  const userRole = useUserRole();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = () => {
    onSignOut();
    navigate('/');
  };

  // Show loading state while determining user role
  if (userRole === 'loading') {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <SmartAvatar
          fallbackText={user?.email || ''}
          size="md"
        />
      </Button>
    );
  }

  const displayName = profile?.business_name || profile?.full_name || 'User';

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
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>My Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/my-bookings" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </Link>
        </DropdownMenuItem>
        
        {userRole === 'host' ? (
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Host Dashboard</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/messages" className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>My Messages</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
