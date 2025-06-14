import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import SmartAvatar from '@/components/ui/smart-avatar';

const MessageThread: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine the correct back navigation path based on current location
  const getBackPath = () => {
    if (location.pathname.includes('/dashboard/messages')) {
      return '/dashboard/messages';
    }
    return '/messages';
  };

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID required');
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          venues(name, city),
          bookings(event_date, guest_count)
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      // Fetch profiles for host and guest
      const [hostProfile, guestProfile] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.host_id).single(),
        supabase.from('profiles').select('*').eq('id', data.guest_id).single()
      ]);

      return {
        ...data,
        hostProfile: hostProfile.data,
        guestProfile: guestProfile.data
      };
    },
    enabled: !!conversationId,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID required');
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId || !user) throw new Error('Missing required data');

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
        });

      if (error) throw error;

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage('');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading conversation...</div>
      </div>
    );
  }

  const isHost = conversation.host_id === user?.id;
  const otherUserProfile = isHost ? conversation.guestProfile : conversation.hostProfile;
  const currentUserProfile = isHost ? conversation.hostProfile : conversation.guestProfile;
  const displayName = isHost 
    ? (otherUserProfile?.full_name || 'Guest')
    : (otherUserProfile?.business_name || otherUserProfile?.full_name || 'Host');

  return (
    <div className="flex flex-col h-full">
      {/* Mobile-optimized Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(getBackPath())}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <SmartAvatar
            src={otherUserProfile?.avatar_url}
            alt={displayName}
            fallbackText={displayName}
            size="md"
          />
          
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{conversation.venues?.name} • {conversation.venues?.city}</span>
            </div>
          </div>
        </div>

        {conversation.bookings && (
          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Booking: </span>
            <span>{new Date(conversation.bookings.event_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages?.map((message) => {
            const isOwn = message.sender_id === user?.id;
            const senderProfile = isOwn ? currentUserProfile : otherUserProfile;
            const senderName = isOwn 
              ? (isHost ? (currentUserProfile?.business_name || currentUserProfile?.full_name) : currentUserProfile?.full_name)
              : displayName;

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <SmartAvatar
                    src={senderProfile?.avatar_url}
                    alt={senderName || ''}
                    fallbackText={senderName || ''}
                    size="sm"
                    className="flex-shrink-0"
                  />
                  
                  <div className={`
                    px-4 py-2 rounded-2xl shadow-sm
                    ${isOwn 
                      ? 'bg-blue-500 text-white rounded-br-md' 
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border'
                    }
                  `}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {format(new Date(message.created_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Mobile-optimized Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-end space-x-2 max-w-4xl mx-auto">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 min-h-[44px] max-h-32 resize-none rounded-full px-4 py-3 border-gray-300 dark:border-gray-600"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="rounded-full h-11 w-11 p-0 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
