import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Users, Settings, Shield, Mail, Plus, 
  Loader2, Save, Trash2, UserPlus, Key
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean | null;
  permissions: Record<string, boolean> | null;
  created_at: string;
  profile?: { full_name: string; avatar_url: string | null } | null;
}

interface PlatformSetting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
}

const rolePermissions: Record<string, string[]> = {
  super_admin: ['All permissions'],
  platform_manager: ['Users', 'Venues', 'Bookings', 'Analytics'],
  content_moderator: ['Moderation', 'Reviews', 'Comments'],
  support_agent: ['Support Tickets', 'Communications'],
  analyst: ['Analytics', 'Reports (Read Only)']
};

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { adminRole, hasPermission } = useAdminAuth();
  const isSuperAdmin = adminRole === 'super_admin';

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null);
  const [newAdminForm, setNewAdminForm] = useState({ userId: '', role: 'support_agent' });
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});

  // Fetch admin users
  const { data: adminUsers, isLoading: loadingAdmins } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Fetch profiles
      const userIds = data?.map(a => a.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data?.map(admin => ({
        ...admin,
        profile: profileMap.get(admin.user_id) || null
      })) as AdminUser[];
    }
  });

  // Fetch platform settings
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .order('key');
      if (error) throw error;
      return data as PlatformSetting[];
    }
  });

  // Add admin mutation
  const addAdminMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: newAdminForm.userId,
          role: newAdminForm.role,
          is_active: true
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast({ title: 'Admin user added' });
      setIsAddAdminOpen(false);
      setNewAdminForm({ userId: '', role: 'support_agent' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error', 
        description: error.message.includes('duplicate') 
          ? 'This user is already an admin' 
          : 'Failed to add admin user', 
        variant: 'destructive' 
      });
    }
  });

  // Toggle admin active status
  const toggleAdminMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast({ title: 'Admin status updated' });
    }
  });

  // Update admin role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { error } = await supabase
        .from('admin_users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast({ title: 'Role updated' });
    }
  });

  // Delete admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
      toast({ title: 'Admin user removed' });
      setDeletingAdmin(null);
    }
  });

  // Update platform setting
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      let parsedValue: string | number | boolean = value;
      // Try to parse as JSON/number
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean') {
          parsedValue = parsed;
        }
      } catch {
        parsedValue = value;
      }

      const { error } = await supabase
        .from('platform_settings')
        .update({ value: parsedValue as string, updated_at: new Date().toISOString() })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] });
      toast({ title: 'Setting updated' });
      setEditingSettings(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin': return <Badge variant="destructive">Super Admin</Badge>;
      case 'platform_manager': return <Badge className="bg-purple-100 text-purple-800">Platform Manager</Badge>;
      case 'content_moderator': return <Badge className="bg-blue-100 text-blue-800">Content Moderator</Badge>;
      case 'support_agent': return <Badge className="bg-green-100 text-green-800">Support Agent</Badge>;
      case 'analyst': return <Badge className="bg-orange-100 text-orange-800">Analyst</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatSettingValue = (value: unknown): string => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground">Manage admin users and platform settings</p>
      </div>

      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Platform Settings
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage who has access to the admin dashboard</CardDescription>
              </div>
              {isSuperAdmin && (
                <Button onClick={() => setIsAddAdminOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loadingAdmins ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {adminUsers?.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{admin.profile?.full_name || 'Unknown'}</span>
                            {getRoleBadge(admin.role)}
                            {!admin.is_active && <Badge variant="outline">Inactive</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Added: {format(new Date(admin.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      {isSuperAdmin && admin.role !== 'super_admin' && (
                        <div className="flex items-center gap-3">
                          <Select
                            value={admin.role}
                            onValueChange={(role) => updateRoleMutation.mutate({ id: admin.id, role })}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="platform_manager">Platform Manager</SelectItem>
                              <SelectItem value="content_moderator">Content Moderator</SelectItem>
                              <SelectItem value="support_agent">Support Agent</SelectItem>
                              <SelectItem value="analyst">Analyst</SelectItem>
                            </SelectContent>
                          </Select>
                          <Switch
                            checked={admin.is_active ?? true}
                            onCheckedChange={(checked) => toggleAdminMutation.mutate({ id: admin.id, isActive: checked })}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingAdmin(admin)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure platform-wide settings and defaults</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSettings ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {settings?.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label className="font-medium">{setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                        </div>
                        {setting.description && (
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 w-64">
                        <Input
                          value={editingSettings[setting.key] ?? formatSettingValue(setting.value)}
                          onChange={(e) => setEditingSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          disabled={!isSuperAdmin}
                        />
                        {isSuperAdmin && editingSettings[setting.key] !== undefined && (
                          <Button
                            size="icon"
                            onClick={() => updateSettingMutation.mutate({ key: setting.key, value: editingSettings[setting.key] })}
                            disabled={updateSettingMutation.isPending}
                          >
                            {updateSettingMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
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

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>View what each admin role can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                  <Card key={role}>
                    <CardHeader className="pb-3">
                      {getRoleBadge(role)}
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        {permissions.map((perm) => (
                          <li key={perm} className="flex items-center gap-2">
                            <Shield className="h-3 w-3 text-primary" />
                            {perm}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Admin Modal */}
      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter user UUID..."
                value={newAdminForm.userId}
                onChange={(e) => setNewAdminForm(prev => ({ ...prev, userId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Enter the UUID of an existing user to grant admin access.</p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={newAdminForm.role}
                onValueChange={(role) => setNewAdminForm(prev => ({ ...prev, role }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform_manager">Platform Manager</SelectItem>
                  <SelectItem value="content_moderator">Content Moderator</SelectItem>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>Cancel</Button>
            <Button
              onClick={() => addAdminMutation.mutate()}
              disabled={!newAdminForm.userId || addAdminMutation.isPending}
            >
              {addAdminMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingAdmin} onOpenChange={() => setDeletingAdmin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{deletingAdmin?.profile?.full_name}" from admin users? They will lose all admin access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingAdmin && deleteAdminMutation.mutate(deletingAdmin.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettings;
