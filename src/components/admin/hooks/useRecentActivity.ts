import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  type: 'user' | 'venue' | 'booking' | 'announcement' | 'ticket';
  message: string;
  timestamp: string;
  color: string;
}

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async (): Promise<ActivityItem[]> => {
      const activities: ActivityItem[] = [];

      // Get recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentUsers) {
        recentUsers.forEach((user) => {
          activities.push({
            id: `user-${user.id}`,
            type: 'user',
            message: `New user registration: ${user.full_name || 'Anonymous User'}`,
            timestamp: user.created_at,
            color: 'bg-green-500',
          });
        });
      }

      // Get recent venues
      const { data: recentVenues } = await supabase
        .from('venues')
        .select('id, name, is_active, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentVenues) {
        recentVenues.forEach((venue) => {
          activities.push({
            id: `venue-${venue.id}`,
            type: 'venue',
            message: venue.is_active 
              ? `Venue "${venue.name}" is now active`
              : `New venue pending approval: "${venue.name}"`,
            timestamp: venue.created_at,
            color: venue.is_active ? 'bg-blue-500' : 'bg-orange-500',
          });
        });
      }

      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('id, status, total_price, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentBookings) {
        recentBookings.forEach((booking) => {
          activities.push({
            id: `booking-${booking.id}`,
            type: 'booking',
            message: `New booking created: ${Number(booking.total_price).toLocaleString()} DA (${booking.status})`,
            timestamp: booking.created_at,
            color: booking.status === 'confirmed' ? 'bg-emerald-500' : 'bg-yellow-500',
          });
        });
      }

      // Get recent announcements
      const { data: recentAnnouncements } = await supabase
        .from('announcements')
        .select('id, title, is_published, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentAnnouncements) {
        recentAnnouncements.forEach((announcement) => {
          if (announcement.is_published) {
            activities.push({
              id: `announcement-${announcement.id}`,
              type: 'announcement',
              message: `Announcement published: "${announcement.title}"`,
              timestamp: announcement.created_at,
              color: 'bg-purple-500',
            });
          }
        });
      }

      // Get recent support tickets
      const { data: recentTickets } = await supabase
        .from('support_tickets')
        .select('id, subject, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentTickets) {
        recentTickets.forEach((ticket) => {
          activities.push({
            id: `ticket-${ticket.id}`,
            type: 'ticket',
            message: `Support ticket: "${ticket.subject}" (${ticket.status})`,
            timestamp: ticket.created_at,
            color: ticket.status === 'open' ? 'bg-red-500' : 'bg-gray-500',
          });
        });
      }

      // Sort by timestamp and return latest 10
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
