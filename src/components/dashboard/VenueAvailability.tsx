
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import UnavailabilityForm, { UnavailabilityData } from './UnavailabilityForm';

const VenueAvailability: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showUnavailabilityForm, setShowUnavailabilityForm] = useState(false);

  const { data: venue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      if (!venueId) throw new Error('Venue ID required');
      
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!venueId,
  });

  const { data: availability } = useQuery({
    queryKey: ['venue-availability', venueId],
    queryFn: async () => {
      if (!venueId) throw new Error('Venue ID required');
      
      const { data, error } = await supabase
        .from('venue_availability')
        .select('*')
        .eq('venue_id', venueId)
        .order('date');

      if (error) throw error;
      return data;
    },
    enabled: !!venueId,
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: async ({ 
      date, 
      isAvailable, 
      unavailabilityData 
    }: { 
      date: string; 
      isAvailable: boolean; 
      unavailabilityData?: UnavailabilityData;
    }) => {
      if (!venueId) throw new Error('Venue ID required');

      console.log('Updating availability:', { date, isAvailable, unavailabilityData });

      let notes = '';
      if (!isAvailable && unavailabilityData) {
        if (unavailabilityData.isExteriorBooking) {
          notes = `Exterior Booking - Guest: ${unavailabilityData.guestFullName}, Phone: ${unavailabilityData.guestPhone}`;
          if (unavailabilityData.guestEmail) {
            notes += `, Email: ${unavailabilityData.guestEmail}`;
          }
          if (unavailabilityData.notes) {
            notes += `, Notes: ${unavailabilityData.notes}`;
          }
        } else {
          notes = unavailabilityData.notes || 'Unavailable';
        }
      } else if (isAvailable) {
        notes = 'Available';
      }

      const { data, error } = await supabase
        .from('venue_availability')
        .upsert({
          venue_id: venueId,
          date,
          is_available: isAvailable,
          notes
        }, {
          onConflict: 'venue_id,date'
        })
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-availability', venueId] });
      toast.success('Availability updated successfully');
      setShowUnavailabilityForm(false);
    },
    onError: (error) => {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  });

  const handleMarkAvailable = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    updateAvailabilityMutation.mutate({ 
      date: dateString, 
      isAvailable: true 
    });
  };

  const handleMarkUnavailable = (date: Date) => {
    setSelectedDate(date);
    setShowUnavailabilityForm(true);
  };

  const handleUnavailabilitySubmit = (unavailabilityData: UnavailabilityData) => {
    if (!selectedDate) return;
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    updateAvailabilityMutation.mutate({ 
      date: dateString, 
      isAvailable: false,
      unavailabilityData
    });
  };

  const getDateAvailability = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return availability?.find(a => a.date === dateString);
  };

  const isDateAvailable = (date: Date) => {
    const dateAvailability = getDateAvailability(date);
    return dateAvailability?.is_available !== false;
  };

  if (!venue) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading venue...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Venue Availability</h1>
          <p className="text-gray-600 dark:text-gray-400">{venue.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
              modifiers={{
                available: (date) => isDateAvailable(date),
                unavailable: (date) => !isDateAvailable(date) && date >= new Date(),
              }}
              modifiersStyles={{
                available: { backgroundColor: '#dcfce7', color: '#166534' },
                unavailable: { backgroundColor: '#fecaca', color: '#dc2626' },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDate && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </span>
                  <Badge variant={isDateAvailable(selectedDate) ? "default" : "destructive"}>
                    {isDateAvailable(selectedDate) ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleMarkAvailable(selectedDate)}
                    disabled={updateAvailabilityMutation.isPending}
                    variant={isDateAvailable(selectedDate) ? "secondary" : "default"}
                  >
                    Mark Available
                  </Button>
                  <Button
                    onClick={() => handleMarkUnavailable(selectedDate)}
                    disabled={updateAvailabilityMutation.isPending}
                    variant={!isDateAvailable(selectedDate) ? "secondary" : "destructive"}
                  >
                    Mark Unavailable
                  </Button>
                </div>

                {/* Show availability details if date is unavailable */}
                {!isDateAvailable(selectedDate) && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Unavailability Details</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {getDateAvailability(selectedDate)?.notes || 'No details available'}
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                  <span>Available dates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                  <span>Unavailable dates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unavailability Form Modal */}
      {showUnavailabilityForm && selectedDate && (
        <UnavailabilityForm
          date={format(selectedDate, 'MMMM d, yyyy')}
          onSubmit={handleUnavailabilitySubmit}
          onCancel={() => setShowUnavailabilityForm(false)}
          isLoading={updateAvailabilityMutation.isPending}
        />
      )}
    </div>
  );
};

export default VenueAvailability;
