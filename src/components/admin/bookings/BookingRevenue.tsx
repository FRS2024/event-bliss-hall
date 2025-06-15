
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Building2, Users } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface VenueRevenueData {
  venue_name: string;
  revenue: number;
  booking_count: number;
}

const BookingRevenue: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [timeRange, setTimeRange] = React.useState('6m');

  const { data: revenueStats, isLoading, error } = useQuery({
    queryKey: ['admin-booking-revenue', timeRange],
    queryFn: async () => {
      console.log('Fetching revenue statistics...');

      // Get monthly revenue data
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('bookings')
        .select('total_price, created_at, status')
        .gte('created_at', new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .in('status', ['confirmed', 'completed']);

      if (monthlyError) throw monthlyError;

      // Get venue revenue data
      const { data: venueData, error: venueError } = await supabase
        .from('bookings')
        .select(`
          total_price,
          venue:venues(name)
        `)
        .in('status', ['confirmed', 'completed'])
        .limit(10);

      if (venueError) throw venueError;

      // Process monthly data
      const monthlyRevenue: RevenueData[] = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const monthBookings = monthlyData?.filter(booking => 
          booking.created_at.startsWith(monthKey)
        ) || [];
        
        monthlyRevenue.push({
          month: monthNames[date.getMonth()],
          revenue: monthBookings.reduce((sum, booking) => sum + Number(booking.total_price), 0),
          bookings: monthBookings.length
        });
      }

      // Process venue data
      const venueRevenue = venueData?.reduce((acc: any[], booking: any) => {
        const venueName = booking.venue?.name || 'Unknown Venue';
        const existing = acc.find(v => v.venue_name === venueName);
        
        if (existing) {
          existing.revenue += Number(booking.total_price);
          existing.booking_count += 1;
        } else {
          acc.push({
            venue_name: venueName,
            revenue: Number(booking.total_price),
            booking_count: 1
          });
        }
        
        return acc;
      }, [] as VenueRevenueData[]) || [];

      // Sort by revenue
      venueRevenue.sort((a, b) => b.revenue - a.revenue);

      const totalRevenue = monthlyData?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0;
      const totalBookings = monthlyData?.length || 0;
      const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      return {
        monthlyRevenue,
        venueRevenue: venueRevenue.slice(0, 5),
        totalRevenue,
        totalBookings,
        avgBookingValue
      };
    },
    enabled: hasPermission(['super_admin', 'platform_manager']),
  });

  if (!hasPermission(['super_admin', 'platform_manager'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view revenue data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading revenue data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading revenue data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track platform revenue and financial performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueStats?.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 6 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats?.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Completed bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueStats?.avgBookingValue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Venues</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats?.venueRevenue.length}</div>
            <p className="text-xs text-muted-foreground">
              Revenue generating
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueStats?.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueStats?.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Revenue Generating Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueStats?.venueRevenue}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={({ venue_name, revenue }) => `${venue_name}: $${revenue.toLocaleString()}`}
                >
                  {revenueStats?.venueRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {revenueStats?.venueRevenue.map((venue, index) => (
                <div key={venue.venue_name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <div className="font-medium">{venue.venue_name}</div>
                      <div className="text-sm text-gray-500">{venue.booking_count} bookings</div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    ${venue.revenue.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingRevenue;
