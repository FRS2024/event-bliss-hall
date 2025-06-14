
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const ChatSidebar: React.FC = () => {
  const { user } = useAuth();
  const userRole = useUserRole();
  const { conversationId } = useParams();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

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
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (isLoading || userRole === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-0"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {!conversations || conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userRole === 'host' 
                ? "Messages will appear when guests contact you"
                : "Messages will appear when you contact hosts"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {conversations.map((conversation) => {
              const lastMessage = conversation.messages?.[conversation.messages.length - 1];
              const unreadCount = conversation.messages?.filter(
                msg => msg.sender_id !== user?.id && !msg.is_read
              ).length || 0;
              
              const isHost = conversation.host_id === user?.id;
              const otherPartyName = isHost ? 'Guest' : 'Host';
              const isActive = conversationId === conversation.id;

              return (
                <Link 
                  key={conversation.id} 
                  to={`/dashboard/messages/${conversation.id}`}
                  className="block"
                >
                  <div className={`
                    flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer
                    ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''}
                  `}>
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 mr-3 flex-shrink-0">
                      <AvatarFallback className={`
                        text-white font-semibold text-sm
                        ${isHost ? 'bg-green-500' : 'bg-blue-500'}
                      `}>
                        {getInitials(!isHost)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium text-gray-900 dark:text-white text-sm ${unreadCount > 0 ? 'font-semibold' : ''}`}>
                          {otherPartyName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center">
                              {unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {lastMessage && formatTimestamp(lastMessage.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 truncate">
                        {conversation.venues?.name} • {conversation.venues?.city}
                      </p>
                      
                      {lastMessage && (
                        <p className={`text-xs text-gray-500 dark:text-gray-400 truncate ${unreadCount > 0 ? 'font-medium text-gray-900 dark:text-white' : ''}`}>
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
