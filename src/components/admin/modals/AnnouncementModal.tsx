import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Megaphone, Send } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const { adminUser } = useAdminAuth();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [targetAudience, setTargetAudience] = React.useState('all');
  const [publishNow, setPublishNow] = React.useState(true);

  const createAnnouncementMutation = useMutation({
    mutationFn: async () => {
      if (!adminUser?.id) throw new Error('Admin user not found');

      const { error } = await supabase
        .from('announcements')
        .insert({
          admin_id: adminUser.id,
          title,
          content,
          target_audience: targetAudience,
          is_published: publishNow,
          sent_at: publishNow ? new Date().toISOString() : null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: 'Announcement Created',
        description: publishNow 
          ? 'Your announcement has been published and sent to users.'
          : 'Your announcement has been saved as a draft.',
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create announcement. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTargetAudience('all');
    setPublishNow(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both title and content.',
        variant: 'destructive',
      });
      return;
    }
    createAnnouncementMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Create Announcement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter announcement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your announcement message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="hosts">Hosts Only</SelectItem>
                <SelectItem value="guests">Guests Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <Label htmlFor="publish-now" className="font-medium">Publish Immediately</Label>
              <p className="text-sm text-muted-foreground">
                {publishNow ? 'Announcement will be sent now' : 'Save as draft'}
              </p>
            </div>
            <Switch
              id="publish-now"
              checked={publishNow}
              onCheckedChange={setPublishNow}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAnnouncementMutation.isPending}>
              <Send className="h-4 w-4 mr-2" />
              {publishNow ? 'Publish Announcement' : 'Save Draft'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementModal;
