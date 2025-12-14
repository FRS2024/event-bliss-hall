import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { 
  Activity, 
  User, 
  Building, 
  Calendar, 
  Shield, 
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string | null;
  details: any;
  admin_id: string | null;
}

const getActionIcon = (action: string) => {
  if (action.includes('create') || action.includes('add') || action.includes('insert')) return <Plus className="h-4 w-4 text-green-500" />;
  if (action.includes('delete') || action.includes('remove')) return <Trash2 className="h-4 w-4 text-red-500" />;
  if (action.includes('update') || action.includes('edit')) return <Edit className="h-4 w-4 text-blue-500" />;
  if (action.includes('verify') || action.includes('approve') || action.includes('confirm')) return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (action.includes('reject') || action.includes('suspend') || action.includes('cancel')) return <XCircle className="h-4 w-4 text-red-500" />;
  if (action.includes('view')) return <Eye className="h-4 w-4 text-gray-500" />;
  return <Activity className="h-4 w-4 text-muted-foreground" />;
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'user': return <User className="h-4 w-4" />;
    case 'venue': return <Building className="h-4 w-4" />;
    case 'booking': return <Calendar className="h-4 w-4" />;
    case 'admin': return <Shield className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

const formatAction = (action: string) => {
  return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const RealTimeActivityFeed = () => {
  const [realtimeActivities, setRealtimeActivities] = useState<ActivityLog[]>([]);

  const { data: initialActivities, isLoading } = useQuery({
    queryKey: ['admin-activity-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as ActivityLog[];
    },
  });

  useEffect(() => {
    if (initialActivities) {
      setRealtimeActivities(initialActivities);
    }
  }, [initialActivities]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-activity-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_activity_log'
        },
        (payload) => {
          const newActivity = payload.new as ActivityLog;
          setRealtimeActivities((prev) => [newActivity, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading activity feed...</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-Time Activity Feed
          <Badge variant="outline" className="ml-auto animate-pulse">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {realtimeActivities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
          ) : (
            <div className="space-y-3">
              {realtimeActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`p-3 border rounded-lg transition-all ${
                    index === 0 ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{formatAction(activity.action)}</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getResourceIcon(activity.resource_type)}
                          {activity.resource_type}
                        </Badge>
                      </div>
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {JSON.stringify(activity.details).substring(0, 100)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.created_at && format(new Date(activity.created_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
