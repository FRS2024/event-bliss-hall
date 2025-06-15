
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const MessagesList: React.FC = () => {
  const { user } = useAuth();
  const userRole = useUserRole();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      // Get conversations where the user is either host or guest
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          venues(name, city),
          messages(
            content,
            created_at,
            sender_id,
            is_read
          )
        `)
        .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading || userRole === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading conversations...</div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    const isHost = userRole === 'host';
    
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-gray-600 mb-4">
            {isHost 
              ? "Messages will appear here when guests contact you about your venues"
              : "Messages will appear here when you contact hosts about venues"
            }
          </p>
          {!isHost && (
            <Button asChild variant="outline">
              <Link to="/venues">Browse Venues</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const getInitials = (isHost: boolean) => {
    return isHost ? 'H' : 'G';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages?.[conversation.messages.length - 1];
        const unreadCount = conversation.messages?.filter(
          msg => msg.sender_id !== user?.id && !msg.is_read
        ).length || 0;
        
        const isHost = conversation.host_id === user?.id;
        const otherPartyName = isHost ? 'Guest' : 'Host';
        const hasUnread = unreadCount > 0;

        return (
          <Link 
            key={conversation.id} 
            to={`/dashboard/messages/${conversation.id}`}
            className="block"
          >
            <div className={`
              flex items-center p-4 rounded-lg transition-all duration-200 cursor-pointer
              hover:bg-gray-50 dark:hover:bg-gray-800/50
              ${hasUnread ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900'}
              border border-gray-200 dark:border-gray-700
            `}>
              {/* Avatar */}
              <Avatar className="h-12 w-12 mr-4 flex-shrink-0">
                <AvatarFallback className={`
                  text-white font-semibold
                  ${isHost ? 'bg-green-500' : 'bg-blue-500'}
                `}>
                  {getInitials(!isHost)}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-medium text-gray-900 dark:text-white ${hasUnread ? 'font-semibold' : ''}`}>
                      {otherPartyName}
                    </h3>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {lastMessage && formatTimestamp(lastMessage.created_at)}
                  </span>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    {conversation.venues?.name || 'Venue Inquiry'} • {conversation.venues?.city}
                  </p>
                </div>
                
                {lastMessage && (
                  <p className={`text-sm text-gray-600 dark:text-gray-400 truncate ${hasUnread ? 'font-medium text-gray-900 dark:text-white' : ''}`}>
                    {lastMessage.content}
                  </p>
                )}
                
                {conversation.booking_id && (
                  <div className="flex items-center mt-2">
                    <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Booking inquiry
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MessagesList;
