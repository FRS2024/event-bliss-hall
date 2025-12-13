import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, TrendingUp, Users, Building, Calendar, 
  DollarSign, Loader2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'];

const AdminAnalytics: React.FC = () => {
  const [dateRange] = useState({ from: subDays(new Date(), 30), to: new Date() });

  // Fetch overview stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalVenues },
        { count: totalBookings },
        { data: bookingsData }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('total_price, status')
      ]);

      const totalRevenue = bookingsData
        ?.filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.total_price), 0) || 0;

      // Get previous month stats for comparison
      const lastMonth = startOfMonth(subDays(new Date(), 30));
      const [
        { count: prevUsers },
        { count: prevVenues },
        { count: prevBookings }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).lt('created_at', lastMonth.toISOString()),
        supabase.from('venues').select('*', { count: 'exact', head: true }).lt('created_at', lastMonth.toISOString()),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).lt('created_at', lastMonth.toISOString())
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalVenues: totalVenues || 0,
        totalBookings: totalBookings || 0,
        totalRevenue,
        userGrowth: prevUsers ? (((totalUsers || 0) - prevUsers) / prevUsers * 100).toFixed(1) : 0,
        venueGrowth: prevVenues ? (((totalVenues || 0) - prevVenues) / prevVenues * 100).toFixed(1) : 0,
        bookingGrowth: prevBookings ? (((totalBookings || 0) - prevBookings) / prevBookings * 100).toFixed(1) : 0
      };
    }
  });

  // Fetch booking trends
  const { data: bookingTrends } = useQuery({
    queryKey: ['booking-trends'],
    queryFn: async () => {
      const { data } = await supabase
        .from('bookings')
        .select('created_at, total_price, status')
        .gte('created_at', subDays(new Date(), 30).toISOString())
        .order('created_at');

      // Group by day
      const grouped = new Map<string, { bookings: number; revenue: number }>();
      for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), 29 - i), 'MMM dd');
        grouped.set(date, { bookings: 0, revenue: 0 });
      }

      data?.forEach(booking => {
        const date = format(new Date(booking.created_at), 'MMM dd');
        const existing = grouped.get(date) || { bookings: 0, revenue: 0 };
        existing.bookings += 1;
        if (booking.status === 'confirmed') {
          existing.revenue += Number(booking.total_price);
        }
        grouped.set(date, existing);
      });

      return Array.from(grouped.entries()).map(([date, data]) => ({
        date,
        ...data
      }));
    }
  });

  // Fetch category distribution
  const { data: categoryData } = useQuery({
    queryKey: ['category-distribution'],
    queryFn: async () => {
      const { data } = await supabase
        .from('venues')
        .select('category');

      const counts = new Map<string, number>();
      data?.forEach(venue => {
        counts.set(venue.category, (counts.get(venue.category) || 0) + 1);
      });

      return Array.from(counts.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    }
  });

  // Fetch user role distribution
  const { data: userRoles } = useQuery({
    queryKey: ['user-role-distribution'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_role');

      const counts = { guest: 0, host: 0 };
      data?.forEach(profile => {
        if (profile.user_role === 'host') counts.host++;
        else counts.guest++;
      });

      return [
        { name: 'Guests', value: counts.guest },
        { name: 'Hosts', value: counts.host }
      ];
    }
  });

  // Fetch booking status distribution
  const { data: bookingStatus } = useQuery({
    queryKey: ['booking-status-distribution'],
    queryFn: async () => {
      const { data } = await supabase
        .from('bookings')
        .select('status');

      const counts = new Map<string, number>();
      data?.forEach(booking => {
        const status = booking.status || 'pending';
        counts.set(status, (counts.get(status) || 0) + 1);
      });

      return Array.from(counts.entries()).map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value 
      }));
    }
  });

  // Fetch top venues
  const { data: topVenues } = useQuery({
    queryKey: ['top-venues'],
    queryFn: async () => {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('venue_id, total_price, status')
        .eq('status', 'confirmed');

      const venueRevenue = new Map<string, number>();
      bookings?.forEach(b => {
        venueRevenue.set(b.venue_id, (venueRevenue.get(b.venue_id) || 0) + Number(b.total_price));
      });

      const topVenueIds = Array.from(venueRevenue.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id);

      if (topVenueIds.length === 0) return [];

      const { data: venues } = await supabase
        .from('venues')
        .select('id, name, category')
        .in('id', topVenueIds);

      return topVenueIds.map(id => {
        const venue = venues?.find(v => v.id === id);
        return {
          name: venue?.name || 'Unknown',
          category: venue?.category || 'Unknown',
          revenue: venueRevenue.get(id) || 0
        };
      });
    }
  });

  const StatCard = ({ title, value, icon: Icon, change, prefix = '' }: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    change?: number | string;
    prefix?: string;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
            {change !== undefined && (
              <div className={`flex items-center text-sm mt-1 ${Number(change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(change) >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{Math.abs(Number(change))}% from last month</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground">Analyze platform performance and metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          change={stats?.userGrowth}
        />
        <StatCard
          title="Total Venues"
          value={stats?.totalVenues || 0}
          icon={Building}
          change={stats?.venueGrowth}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          change={stats?.bookingGrowth}
        />
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue || 0}
          icon={DollarSign}
          prefix="MAD "
        />
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Booking Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          {/* Booking & Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings & Revenue (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      name="Bookings"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                      name="Revenue (MAD)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Venues by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Roles */}
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRoles}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Booking Status */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingStatus}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {bookingStatus?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Top Venues */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Venues</CardTitle>
              <CardDescription>Venues with highest confirmed booking revenue</CardDescription>
            </CardHeader>
            <CardContent>
              {topVenues?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No booking data available yet
                </div>
              ) : (
                <div className="space-y-4">
                  {topVenues?.map((venue, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{venue.name}</p>
                          <Badge variant="outline">{venue.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">MAD {venue.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
