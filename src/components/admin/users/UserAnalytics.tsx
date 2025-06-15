
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Calendar, UserPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface UserStats {
  totalUsers: number;
  totalHosts: number;
  totalGuests: number;
  newUsersThisMonth: number;
  activeUsersThisMonth: number;
  userGrowthData: Array<{ date: string; users: number; hosts: number; guests: number }>;
  userTypeDistribution: Array<{ name: string; value: number; color: string }>;
}

const UserAnalytics: React.FC = () => {
  const { hasPermission } = useAdminAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-user-analytics'],
    queryFn: async (): Promise<UserStats> => {
      console.log('Fetching user analytics...');

      // Get total user counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, business_name, created_at');

      if (profilesError) throw profilesError;

      const totalUsers = profiles.length;
      const totalHosts = profiles.filter(p => p.business_name).length;
      const totalGuests = totalUsers - totalHosts;

      // Get new users this month
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const newUsersThisMonth = profiles.filter(p => 
        new Date(p.created_at) >= currentMonth
      ).length;

      // Get active users (those with bookings in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('guest_id, host_id')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (bookingsError) throw bookingsError;

      const activeUserIds = new Set([
        ...activeBookings.map(b => b.guest_id),
        ...activeBookings.map(b => b.host_id)
      ]);
      const activeUsersThisMonth = activeUserIds.size;

      // Generate growth data for the last 30 days
      const userGrowthData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const usersUpToDate = profiles.filter(p => 
          new Date(p.created_at) <= date
        );
        
        userGrowthData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: usersUpToDate.length,
          hosts: usersUpToDate.filter(p => p.business_name).length,
          guests: usersUpToDate.filter(p => !p.business_name).length
        });
      }

      const userTypeDistribution = [
        { name: 'Guests', value: totalGuests, color: '#3b82f6' },
        { name: 'Hosts', value: totalHosts, color: '#10b981' }
      ];

      return {
        totalUsers,
        totalHosts,
        totalGuests,
        newUsersThisMonth,
        activeUsersThisMonth,
        userGrowthData,
        userTypeDistribution
      };
    },
    enabled: hasPermission(['super_admin', 'platform_manager', 'analyst']),
  });

  if (!hasPermission(['super_admin', 'platform_manager', 'analyst'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view user analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Analytics</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading user analytics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Analytics</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading user analytics. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze user behavior and platform growth trends
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Analytics Dashboard</span>
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Active in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Host Conversion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers > 0 ? Math.round((stats.totalHosts / stats.totalUsers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Users becoming hosts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>User Growth Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
                  <Line type="monotone" dataKey="hosts" stroke="#10b981" strokeWidth={2} name="Hosts" />
                  <Line type="monotone" dataKey="guests" stroke="#f59e0b" strokeWidth={2} name="Guests" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Type Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.userTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.userTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Guest Users</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{stats.totalGuests}</div>
                  <div className="text-sm text-gray-500">
                    {stats.totalUsers > 0 ? Math.round((stats.totalGuests / stats.totalUsers) * 100) : 0}% of total
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Host Users</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{stats.totalHosts}</div>
                  <div className="text-sm text-gray-500">
                    {stats.totalUsers > 0 ? Math.round((stats.totalHosts / stats.totalUsers) * 100) : 0}% of total
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Engagement Rate</span>
                <span className="font-semibold">
                  {stats.totalUsers > 0 ? Math.round((stats.activeUsersThisMonth / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Growth Rate</span>
                <span className="font-semibold text-green-600">
                  {stats.totalUsers > 0 ? Math.round((stats.newUsersThisMonth / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Host Conversion Rate</span>
                <span className="font-semibold text-blue-600">
                  {stats.totalUsers > 0 ? Math.round((stats.totalHosts / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Users per Day</span>
                <span className="font-semibold">
                  {Math.round(stats.totalUsers / 30)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAnalytics;
