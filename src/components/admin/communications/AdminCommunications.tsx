import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Megaphone, Ticket, Mail, Plus, Send, 
  Loader2, Eye, MessageSquare, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: string | null;
  is_published: boolean | null;
  sent_at: string | null;
  created_at: string;
}

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  content: string;
  status: string | null;
  priority: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
  admin_notes: string | null;
  profile?: { full_name: string; avatar_url: string | null } | null;
}

interface TicketResponse {
  id: string;
  ticket_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

const AdminCommunications: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { adminUser } = useAdminAuth();
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketResponse, setTicketResponse] = useState('');
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    target_audience: 'all'
  });

  // Fetch announcements
  const { data: announcements, isLoading: loadingAnnouncements } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Announcement[];
    }
  });

  // Fetch support tickets
  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ['admin-support-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Fetch profiles for users
      const userIds = [...new Set(data?.map(t => t.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data?.map(ticket => ({
        ...ticket,
        profile: profileMap.get(ticket.user_id) || null
      })) as SupportTicket[];
    }
  });

  // Fetch ticket responses
  const { data: responses } = useQuery({
    queryKey: ['ticket-responses', selectedTicket?.id],
    queryFn: async () => {
      if (!selectedTicket) return [];
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as TicketResponse[];
    },
    enabled: !!selectedTicket
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async () => {
      if (!adminUser) throw new Error('Not authorized');
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: announcementForm.title,
          content: announcementForm.content,
          target_audience: announcementForm.target_audience,
          admin_id: adminUser.id,
          is_published: false
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast({ title: 'Announcement created' });
      setIsAnnouncementModalOpen(false);
      setAnnouncementForm({ title: '', content: '', target_audience: 'all' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create announcement', variant: 'destructive' });
    }
  });

  // Publish announcement mutation
  const publishAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .update({ is_published: true, sent_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      toast({ title: 'Announcement published' });
    }
  });

  // Update ticket status mutation
  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) updateData.admin_notes = notes;
      if (status === 'resolved') updateData.resolved_at = new Date().toISOString();

      const { error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      toast({ title: 'Ticket updated' });
    }
  });

  // Add ticket response mutation
  const addResponseMutation = useMutation({
    mutationFn: async ({ ticketId, content }: { ticketId: string; content: string }) => {
      if (!adminUser) throw new Error('Not authorized');
      const { error } = await supabase
        .from('ticket_responses')
        .insert({
          ticket_id: ticketId,
          admin_id: adminUser.id,
          content,
          is_internal: false
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-responses', selectedTicket?.id] });
      toast({ title: 'Response sent' });
      setTicketResponse('');
    }
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'open': return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'closed': return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string | null) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return null;
    }
  };

  const openTickets = tickets?.filter(t => t.status === 'open') || [];
  const inProgressTickets = tickets?.filter(t => t.status === 'in_progress') || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communications</h1>
        <p className="text-muted-foreground">Manage announcements and support tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Megaphone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{announcements?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openTickets.length}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressTickets.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tickets?.filter(t => t.status === 'resolved').length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Support Tickets
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tickets List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {loadingTickets ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : tickets?.length === 0 ? (
                  <div className="text-center py-8">
                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No support tickets</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets?.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedTicket?.id === ticket.id ? 'border-primary bg-muted/30' : ''
                        }`}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium line-clamp-1">{ticket.subject}</h4>
                          <div className="flex gap-1">
                            {getPriorityBadge(ticket.priority)}
                            {getStatusBadge(ticket.status)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ticket.content}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{ticket.profile?.full_name || 'Unknown User'}</span>
                          <span>{format(new Date(ticket.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ticket Detail */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedTicket ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a ticket to view details</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
                      <div className="flex gap-2 mt-2">
                        {getPriorityBadge(selectedTicket.priority)}
                        {getStatusBadge(selectedTicket.status)}
                        <Badge variant="outline">{selectedTicket.category}</Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{selectedTicket.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        From: {selectedTicket.profile?.full_name || 'Unknown'} • {format(new Date(selectedTicket.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>

                    {/* Responses */}
                    {responses && responses.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Responses</h4>
                        {responses.map((response) => (
                          <div key={response.id} className="p-3 bg-primary/5 border-l-2 border-primary rounded">
                            <p className="text-sm">{response.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Admin • {format(new Date(response.created_at), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Select
                        value={selectedTicket.status || 'open'}
                        onValueChange={(status) => updateTicketMutation.mutate({ id: selectedTicket.id, status })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reply Form */}
                    <div className="space-y-2">
                      <Label>Reply</Label>
                      <Textarea
                        placeholder="Type your response..."
                        value={ticketResponse}
                        onChange={(e) => setTicketResponse(e.target.value)}
                        rows={3}
                      />
                      <Button
                        onClick={() => addResponseMutation.mutate({ ticketId: selectedTicket.id, content: ticketResponse })}
                        disabled={!ticketResponse.trim() || addResponseMutation.isPending}
                      >
                        {addResponseMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Announcements</CardTitle>
              <Button onClick={() => setIsAnnouncementModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </CardHeader>
            <CardContent>
              {loadingAnnouncements ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : announcements?.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No announcements yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements?.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{announcement.title}</h4>
                            {announcement.is_published ? (
                              <Badge className="bg-green-100 text-green-800">Published</Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                            <Badge variant="secondary" className="capitalize">
                              {announcement.target_audience}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Created: {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                            {announcement.sent_at && ` • Sent: ${format(new Date(announcement.sent_at), 'MMM d, yyyy')}`}
                          </p>
                        </div>
                        {!announcement.is_published && (
                          <Button
                            size="sm"
                            onClick={() => publishAnnouncementMutation.mutate(announcement.id)}
                            disabled={publishAnnouncementMutation.isPending}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Announcement Modal */}
      <Dialog open={isAnnouncementModalOpen} onOpenChange={setIsAnnouncementModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Announcement title..."
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Announcement content..."
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select
                value={announcementForm.target_audience}
                onValueChange={(value) => setAnnouncementForm(prev => ({ ...prev, target_audience: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="hosts">Hosts Only</SelectItem>
                  <SelectItem value="guests">Guests Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnnouncementModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createAnnouncementMutation.mutate()}
              disabled={!announcementForm.title || !announcementForm.content || createAnnouncementMutation.isPending}
            >
              {createAnnouncementMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommunications;
