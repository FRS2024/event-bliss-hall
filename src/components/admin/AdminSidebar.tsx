
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  Shield, 
  BarChart3, 
  Megaphone, 
  Settings,
  Flag,
  Ticket,
  UserCheck,
  MapPin,
  Activity,
  Star,
  CheckCircle,
  Layers,
  FileText,
  MessageSquareQuote,
  HelpCircle,
  Layout
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { adminRole, hasPermission } = useAdminAuth();

  const menuItems = [
    {
      title: 'Overview',
      icon: LayoutDashboard,
      path: '/admin',
      roles: ['super_admin', 'platform_manager', 'analyst']
    },
    {
      title: 'Activity Feed',
      icon: Activity,
      path: '/admin/activity',
      roles: ['super_admin', 'platform_manager']
    },
    {
      title: 'Bulk Operations',
      icon: Layers,
      path: '/admin/operations',
      roles: ['super_admin', 'platform_manager']
    },
    {
      title: 'Users',
      icon: Users,
      roles: ['super_admin', 'platform_manager', 'support_agent'],
      submenu: [
        { title: 'All Users', path: '/admin/users', icon: Users },
        { title: 'Hosts', path: '/admin/users/hosts', icon: UserCheck },
        { title: 'Guests', path: '/admin/users/guests', icon: Users },
        { title: 'Verification', path: '/admin/users/verification', icon: CheckCircle },
        { title: 'User Analytics', path: '/admin/users/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Venues',
      icon: Building2,
      roles: ['super_admin', 'platform_manager'],
      submenu: [
        { title: 'Pending Approval', path: '/admin/venues/pending', icon: Building2 },
        { title: 'Active Venues', path: '/admin/venues/active', icon: MapPin },
        { title: 'Flagged Venues', path: '/admin/venues/flagged', icon: Flag },
        { title: 'Quality Scores', path: '/admin/venues/quality', icon: Star },
        { title: 'Categories', path: '/admin/venues/categories', icon: Settings },
      ]
    },
    {
      title: 'Bookings',
      icon: Calendar,
      roles: ['super_admin', 'platform_manager', 'support_agent'],
      submenu: [
        { title: 'All Bookings', path: '/admin/bookings', icon: Calendar },
        { title: 'Disputes', path: '/admin/bookings/disputes', icon: Shield },
        { title: 'Revenue', path: '/admin/bookings/revenue', icon: BarChart3 },
        { title: 'Analytics', path: '/admin/bookings/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Content',
      icon: FileText,
      roles: ['super_admin', 'platform_manager', 'content_moderator'],
      submenu: [
        { title: 'Legal Pages', path: '/admin/content/pages', icon: FileText },
        { title: 'Testimonials', path: '/admin/content/testimonials', icon: MessageSquareQuote },
        { title: 'FAQs', path: '/admin/content/faqs', icon: HelpCircle },
        { title: 'Homepage', path: '/admin/content/homepage', icon: Layout },
      ]
    },
    {
      title: 'Moderation',
      icon: Shield,
      roles: ['super_admin', 'platform_manager', 'content_moderator'],
      submenu: [
        { title: 'Reviews', path: '/admin/moderation/reviews', icon: Shield },
        { title: 'Photos', path: '/admin/moderation/photos', icon: Shield },
        { title: 'Reports', path: '/admin/moderation/reports', icon: Flag },
        { title: 'Rules', path: '/admin/moderation/rules', icon: Settings },
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      roles: ['super_admin', 'platform_manager', 'analyst'],
      submenu: [
        { title: 'Platform Metrics', path: '/admin/analytics/platform', icon: BarChart3 },
        { title: 'Financial Reports', path: '/admin/analytics/financial', icon: BarChart3 },
        { title: 'User Behavior', path: '/admin/analytics/users', icon: BarChart3 },
        { title: 'Custom Reports', path: '/admin/analytics/custom', icon: BarChart3 },
      ]
    },
    {
      title: 'Communications',
      icon: Megaphone,
      roles: ['super_admin', 'platform_manager', 'support_agent'],
      submenu: [
        { title: 'Announcements', path: '/admin/communications/announcements', icon: Megaphone },
        { title: 'Support Tickets', path: '/admin/communications/tickets', icon: Ticket },
        { title: 'Templates', path: '/admin/communications/templates', icon: Settings },
        { title: 'Campaigns', path: '/admin/communications/campaigns', icon: Megaphone },
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      roles: ['super_admin'],
      submenu: [
        { title: 'Admin Users', path: '/admin/settings/admins', icon: Users },
        { title: 'Permissions', path: '/admin/settings/permissions', icon: Shield },
        { title: 'Platform Config', path: '/admin/settings/config', icon: Settings },
        { title: 'Integrations', path: '/admin/settings/integrations', icon: Settings },
      ]
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.roles as any)
  );

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700">
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              EasyHall Admin
            </h2>
            <p className="text-xs text-gray-500 capitalize">
              {adminRole?.replace('_', ' ')} Dashboard
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.path}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={location.pathname === subItem.path}
                              >
                                <Link to={subItem.path}>
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
