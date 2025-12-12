import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useRecentActivity, formatRelativeTime } from './hooks/useRecentActivity';
import ExportReportModal from './modals/ExportReportModal';
import AnnouncementModal from './modals/AnnouncementModal';
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  Megaphone
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminOverview: React.FC = () => {
  const { stats, isLoading, error } = useAdminStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading dashboard statistics...</div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600">Unable to load dashboard statistics. Please refresh the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickActions = [
    { title: 'Review Pending Venues', count: stats.pending.venues, color: 'bg-orange-500', path: '/admin/venues/pending' },
    { title: 'Handle Support Tickets', count: stats.pending.tickets, color: 'bg-blue-500', path: '/admin/communications/tickets' },
    { title: 'Resolve Booking Disputes', count: stats.pending.bookings, color: 'bg-red-500', path: '/admin/bookings/disputes' },
    { title: 'Moderate Flagged Content', count: stats.pending.flags, color: 'bg-purple-500', path: '/admin/moderation/reports' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome to EasyHall's mission control center</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setExportModalOpen(true)}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setAnnouncementModalOpen(true)}>
            <Megaphone className="h-4 w-4 mr-2" />
            Send Announcement
          </Button>
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
            <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{stats.today.newUsers} today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Venues</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.activeVenues}</div>
            <p className="text-xs text-muted-foreground">{stats.pending.venues} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalBookings}</div>
            <p className="text-xs text-muted-foreground">+{stats.today.newBookings} today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalRevenue} DA</div>
            <p className="text-xs text-muted-foreground">+{stats.today.revenue} DA today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Quick Actions Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{action.title}</p>
                  <Badge variant={action.count > 0 ? "destructive" : "secondary"} className="mt-1">
                    {action.count} items
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant={action.count > 0 ? "default" : "outline"}
                  onClick={() => window.location.href = action.path}
                >
                  {action.count > 0 ? 'Review' : 'View'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <LineChart data={stats.charts.userGrowth.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenue Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.bookingTrends.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Now from Database */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Recent Platform Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLoading ? (
              <p className="text-muted-foreground text-center py-4">Loading activity...</p>
            ) : recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                    <span className="text-sm">{activity.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ExportReportModal open={exportModalOpen} onOpenChange={setExportModalOpen} />
      <AnnouncementModal open={announcementModalOpen} onOpenChange={setAnnouncementModalOpen} />
    </div>
  );
};

export default AdminOverview;
