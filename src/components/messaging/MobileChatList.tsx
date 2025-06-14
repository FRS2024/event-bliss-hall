
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import SmartAvatar from '@/components/ui/smart-avatar';

const MobileChatList: React.FC = () => {
  const { user } = useAuth();
  const userRole = useUserRole();

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

      // Fetch profiles for each conversation
      const conversationsWithProfiles = await Promise.all(
        data.map(async (conversation) => {
          const isHost = conversation.host_id === user.id;
          const otherUserId = isHost ? conversation.guest_id : conversation.host_id;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();

          return {
            ...conversation,
            otherUserProfile: profile
          };
        })
      );

      return conversationsWithProfiles;
    },
    enabled: !!user,
  });

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
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    const isHost = userRole === 'host';
    
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {isHost 
            ? "Messages will appear here when guests contact you about your venues"
            : "Messages will appear here when you contact hosts about venues"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {conversations.map((conversation, index) => {
        const lastMessage = conversation.messages?.[conversation.messages.length - 1];
        const unreadCount = conversation.messages?.filter(
          msg => msg.sender_id !== user?.id && !msg.is_read
        ).length || 0;
        
        const isHost = conversation.host_id === user?.id;
        const otherUserProfile = conversation.otherUserProfile;
        const displayName = isHost 
          ? (otherUserProfile?.full_name || 'Guest')
          : (otherUserProfile?.business_name || otherUserProfile?.full_name || 'Host');

        return (
          <Link 
            key={conversation.id} 
            to={`/messages/${conversation.id}`}
            className="block"
          >
            <div className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {/* Avatar with online status */}
              <div className="relative mr-3 flex-shrink-0">
                <SmartAvatar
                  src={otherUserProfile?.avatar_url}
                  alt={displayName}
                  fallbackText={displayName}
                  size="lg"
                  className="w-12 h-12"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {displayName}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[18px] h-4">
                        {unreadCount}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {lastMessage && formatTimestamp(lastMessage.created_at)}
                    </span>
                  </div>
                </div>
                
                {lastMessage && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {lastMessage.content}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {conversation.venues?.name} • {conversation.venues?.city}
                </p>
              </div>
            </div>
            
            {/* Separator line */}
            {index < conversations.length - 1 && (
              <div className="ml-16 border-b border-gray-100 dark:border-gray-800"></div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileChatList;
