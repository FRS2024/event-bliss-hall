
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface UserDropdownProps {
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onSignOut }) => {
  const { user } = useAuth();
  const userRole = useUserRole();
  const navigate = useNavigate();

  const handleSignOut = () => {
    onSignOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const getUserAvatar = () => {
    // If user has a Google avatar, it would be in user.user_metadata.avatar_url
    return user?.user_metadata?.avatar_url || null;
  };

  // Show loading state while determining user role
  if (userRole === 'loading') {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-blush-100 text-blush-600 dark:bg-blush-900 dark:text-blush-300">
            {user?.email ? getInitials(user.email) : <UserIcon size={16} />}
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getUserAvatar()} alt={user?.email} />
            <AvatarFallback className="bg-blush-100 text-blush-600 dark:bg-blush-900 dark:text-blush-300">
              {user?.email ? getInitials(user.email) : <UserIcon size={16} />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.user_metadata?.full_name || 'User'}
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
