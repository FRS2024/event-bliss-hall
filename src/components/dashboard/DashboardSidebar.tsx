
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Calendar, MessageSquare, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUserRole } from '@/hooks/useUserRole';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const userRole = useUserRole();
  const { t } = useTranslation();
  
  // Define all menu items with role restrictions
  const allMenuItems = [
    { icon: Home, label: t('dashboard.overview'), path: '/dashboard', roles: ['host'] },
    { icon: Plus, label: t('dashboard.addVenue'), path: '/dashboard/add-venue', roles: ['host'] },
    { icon: Calendar, label: t('dashboard.bookings'), path: '/dashboard/bookings', roles: ['host', 'guest'] },
    { icon: MessageSquare, label: t('dashboard.messages'), path: '/dashboard/messages', roles: ['host', 'guest'] },
    { icon: Settings, label: t('dashboard.settings'), path: '/dashboard/settings', roles: ['host'] },
  ];

  // Filter menu items based on user role
  const menuItems = userRole === 'loading' 
    ? [] 
    : allMenuItems.filter(item => item.roles.includes(userRole));

  // Determine dashboard title based on role
  const getDashboardTitle = () => {
    if (userRole === 'loading') return t('dashboard.title');
    return userRole === 'host' ? t('dashboard.hostDashboard') : t('dashboard.guestDashboard');
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-semibold text-blush-600 dark:text-blush-400">
          {getDashboardTitle()}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
              >
                <Link to={item.path}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
