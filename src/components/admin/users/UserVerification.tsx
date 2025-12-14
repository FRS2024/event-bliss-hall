import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Shield, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Profile {
  id: string;
  full_name: string | null;
  user_role: string | null;
  is_verified: boolean | null;
  verified_at: string | null;
  verification_documents: any[] | null;
  created_at: string | null;
  avatar_url: string | null;
}

export const UserVerification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: pendingUsers, isLoading } = useQuery({
    queryKey: ['pending-verification'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_verified', false)
        .eq('user_role', 'host')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: verifiedUsers } = useQuery({
    queryKey: ['verified-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_verified', true)
        .order('verified_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ userId, approved }: { userId: string; approved: boolean }) => {
      const updates = approved 
        ? { is_verified: true, verified_at: new Date().toISOString(), verified_by: user?.id }
        : { is_verified: false };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) throw error;

      // Log activity
      await supabase.from('admin_activity_log').insert({
        admin_id: user?.id,
        action: approved ? 'user_verified' : 'user_verification_rejected',
        resource_type: 'user',
        resource_id: userId,
        details: { reason: rejectionReason || null },
      });
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({ queryKey: ['pending-verification'] });
      queryClient.invalidateQueries({ queryKey: ['verified-users'] });
      toast.success(approved ? 'User verified successfully' : 'Verification rejected');
      setSelectedUser(null);
      setRejectionReason('');
    },
    onError: () => toast.error('Failed to update verification status'),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Verification ({pendingUsers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pending verifications</p>
          ) : (
            <div className="space-y-3">
              {pendingUsers?.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{profile.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                        Registered {profile.created_at && format(new Date(profile.created_at), 'PP')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{profile.user_role}</Badge>
                    <Button size="sm" onClick={() => setSelectedUser(profile)}>
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Recently Verified
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verifiedUsers?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No verified users yet</p>
          ) : (
            <div className="space-y-2">
              {verifiedUsers?.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{profile.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        Verified {profile.verified_at && format(new Date(profile.verified_at), 'PP')}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify User: {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p><strong>Role:</strong> {selectedUser?.user_role}</p>
              <p><strong>Registered:</strong> {selectedUser?.created_at && format(new Date(selectedUser.created_at), 'PPP')}</p>
              {selectedUser?.verification_documents && selectedUser.verification_documents.length > 0 && (
                <div>
                  <p className="font-medium flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Documents:
                  </p>
                  <ul className="list-disc list-inside text-sm">
                    {selectedUser.verification_documents.map((doc: any, i: number) => (
                      <li key={i}>{doc.name || 'Document ' + (i + 1)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Rejection Reason (optional)</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
              />
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="destructive"
                onClick={() => selectedUser && verifyMutation.mutate({ userId: selectedUser.id, approved: false })}
              >
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </Button>
              <Button 
                className="flex-1"
                onClick={() => selectedUser && verifyMutation.mutate({ userId: selectedUser.id, approved: true })}
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
