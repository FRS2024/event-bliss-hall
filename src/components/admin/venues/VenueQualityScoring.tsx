import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star, RefreshCw, TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VenueWithScore {
  id: string;
  name: string;
  city: string;
  category: string;
  quality_score: number | null;
  last_quality_check: string | null;
  quality_notes: string | null;
  is_active: boolean | null;
}

const getScoreBadge = (score: number) => {
  if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
  if (score >= 60) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
  if (score >= 40) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' };
  if (score >= 20) return { label: 'Below Average', color: 'bg-orange-100 text-orange-800' };
  return { label: 'Poor', color: 'bg-red-100 text-red-800' };
};

export const VenueQualityScoring = () => {
  const queryClient = useQueryClient();
  const [selectedVenue, setSelectedVenue] = useState<VenueWithScore | null>(null);
  const [qualityNotes, setQualityNotes] = useState('');

  const { data: venues, isLoading } = useQuery({
    queryKey: ['venue-quality-scores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('id, name, city, category, quality_score, last_quality_check, quality_notes, is_active')
        .order('quality_score', { ascending: false, nullsFirst: false });
      
      if (error) throw error;
      return data as VenueWithScore[];
    },
  });

  const recalculateMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { data, error } = await supabase.rpc('calculate_venue_quality_score', { venue_uuid: venueId });
      if (error) throw error;
      
      const { error: updateError } = await supabase
        .from('venues')
        .update({ 
          quality_score: data, 
          last_quality_check: new Date().toISOString() 
        })
        .eq('id', venueId);
      
      if (updateError) throw updateError;
      return data;
    },
    onSuccess: (score) => {
      queryClient.invalidateQueries({ queryKey: ['venue-quality-scores'] });
      toast.success(`Quality score updated: ${score}`);
    },
    onError: () => toast.error('Failed to recalculate score'),
  });

  const recalculateAllMutation = useMutation({
    mutationFn: async () => {
      const allVenues = venues || [];
      for (const venue of allVenues) {
        const { data } = await supabase.rpc('calculate_venue_quality_score', { venue_uuid: venue.id });
        await supabase
          .from('venues')
          .update({ quality_score: data, last_quality_check: new Date().toISOString() })
          .eq('id', venue.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-quality-scores'] });
      toast.success('All venue scores recalculated');
    },
    onError: () => toast.error('Failed to recalculate scores'),
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ venueId, notes }: { venueId: string; notes: string }) => {
      const { error } = await supabase
        .from('venues')
        .update({ quality_notes: notes })
        .eq('id', venueId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-quality-scores'] });
      toast.success('Quality notes updated');
      setSelectedVenue(null);
    },
    onError: () => toast.error('Failed to update notes'),
  });

  const averageScore = venues?.length 
    ? venues.reduce((sum, v) => sum + (v.quality_score || 0), 0) / venues.length 
    : 0;

  const topVenues = venues?.filter(v => (v.quality_score || 0) >= 80).length || 0;
  const lowVenues = venues?.filter(v => (v.quality_score || 0) < 40).length || 0;

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Venue Quality Scoring</h2>
        <Button 
          onClick={() => recalculateAllMutation.mutate()}
          disabled={recalculateAllMutation.isPending}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${recalculateAllMutation.isPending ? 'animate-spin' : ''}`} />
          Recalculate All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{averageScore.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{topVenues}</p>
                <p className="text-sm text-muted-foreground">Excellent Venues (80+)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{lowVenues}</p>
                <p className="text-sm text-muted-foreground">Needs Improvement (&lt;40)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Venues by Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {venues?.map((venue) => {
              const score = venue.quality_score || 0;
              const badge = getScoreBadge(score);
              return (
                <div key={venue.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{venue.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {venue.city} • {venue.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={badge.color}>{badge.label}</Badge>
                      <span className="font-bold text-lg">{score.toFixed(1)}</span>
                    </div>
                  </div>
                  <Progress value={score} className="h-2 mb-2" />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                      Last check: {venue.last_quality_check 
                        ? format(new Date(venue.last_quality_check), 'PP') 
                        : 'Never'}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedVenue(venue);
                          setQualityNotes(venue.quality_notes || '');
                        }}
                      >
                        Notes
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => recalculateMutation.mutate(venue.id)}
                        disabled={recalculateMutation.isPending}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedVenue} onOpenChange={() => setSelectedVenue(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quality Notes: {selectedVenue?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={qualityNotes}
              onChange={(e) => setQualityNotes(e.target.value)}
              placeholder="Add notes about venue quality, issues, or improvements needed..."
              rows={4}
            />
            <Button 
              className="w-full"
              onClick={() => selectedVenue && updateNotesMutation.mutate({ 
                venueId: selectedVenue.id, 
                notes: qualityNotes 
              })}
            >
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
