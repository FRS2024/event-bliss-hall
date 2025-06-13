
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, MessageCircle } from 'lucide-react';
import { Venue } from '@/types';
import { createConversation, sendMessage } from '@/lib/api';
import { toast } from 'sonner';

interface ContactFormProps {
  venue: Venue;
  onSubmit: (conversationId: string) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ venue, onSubmit, onCancel }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsLoading(true);
    try {
      // Create conversation
      const conversation = await createConversation(venue.id);
      
      // Send initial message
      await sendMessage(conversation.id, message.trim());

      toast.success('Message sent successfully!');
      onSubmit(conversation.id);
    } catch (error: any) {
      console.error('Contact error:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact Host
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold">{venue.name}</h3>
            <p className="text-sm text-gray-600">{venue.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'm interested in your venue. Could you please provide more information about availability and pricing?"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading || !message.trim()} className="flex-1">
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
