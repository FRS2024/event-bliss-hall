
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Calendar, MessageSquare, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Overview', path: '/dashboard' },
    { icon: Plus, label: 'Add Venue', path: '/dashboard/add-venue' },
    { icon: Calendar, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-semibold text-blush-600 dark:text-blush-400">
          Host Dashboard
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
