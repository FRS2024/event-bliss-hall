
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MessagesList: React.FC = () => {
  const { user } = useAuth();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      // Get conversations where the user is either host or guest
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          venue:venues(name, city),
          messages:messages(
            content,
            created_at,
            sender_id
          )
        `)
        .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading conversations...</div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-gray-600">Messages will appear here when guests contact you about your venues</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages?.[conversation.messages.length - 1];
        const unreadCount = conversation.messages?.filter(
          msg => msg.sender_id !== user?.id && !msg.is_read
        ).length || 0;
        
        const isHost = conversation.host_id === user?.id;
        const otherPartyName = isHost ? 'Guest' : 'Host';

        return (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to={`/dashboard/messages/${conversation.id}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{otherPartyName}</h3>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {conversation.venue && (
                      <div className="flex items-center text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {conversation.venue.city}
                      </div>
                    )}
                  </span>
                </div>
                
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Re: {conversation.venue?.name || 'Venue Inquiry'}
                  </h4>
                </div>
                
                {lastMessage && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {lastMessage.content}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {conversation.booking_id && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Booking inquiry
                      </div>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
                    {lastMessage && new Date(lastMessage.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};

export default MessagesList;
