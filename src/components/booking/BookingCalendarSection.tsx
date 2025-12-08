import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import DualMonthCalendar from './DualMonthCalendar';
import BookingForm from './BookingForm';
import { useVenueAvailability } from '@/hooks/useVenueAvailability';
import { Venue } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BookingCalendarSectionProps {
  venue: Venue;
}

const BookingCalendarSection: React.FC<BookingCalendarSectionProps> = ({ venue }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { isDateAvailable, isPastDate, isLoading } = useVenueAvailability(venue.id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleClearDates = () => {
    setSelectedDate(null);
  };

  const handleReserve = () => {
    if (!user) {
      toast.error('Please log in to make a reservation');
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }

    setShowBookingForm(true);
  };

  const handleBookingSubmit = (bookingId: string) => {
    setShowBookingForm(false);
    setSelectedDate(null);
    navigate('/my-bookings');
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <DualMonthCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        isDateAvailable={isDateAvailable}
        isPastDate={isPastDate}
        isLoading={isLoading}
      />

      {/* Selected Date & Actions */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        {/* Selected Date Display */}
        {selectedDate ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected Date</p>
              <p className="text-lg font-semibold text-foreground">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDates}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            Select a date to check availability
          </p>
        )}

        {/* Reserve Button */}
        <Button
          onClick={handleReserve}
          disabled={!selectedDate}
          className="w-full h-12 text-base font-semibold"
        >
          Reserve
        </Button>

        {/* Availability Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-foreground/80"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          venue={venue}
          initialDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined}
          onSubmit={handleBookingSubmit}
          onCancel={handleBookingCancel}
        />
      )}
    </div>
  );
};

export default BookingCalendarSection;
