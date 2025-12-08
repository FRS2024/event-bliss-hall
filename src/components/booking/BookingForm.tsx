
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Users, Clock } from 'lucide-react';
import { Venue } from '@/types';
import { createBooking } from '@/lib/api';
import { toast } from 'sonner';

interface BookingFormProps {
  venue: Venue;
  initialDate?: string;
  onSubmit: (bookingId: string) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ venue, initialDate, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    eventDate: initialDate || '',
    startTime: '',
    endTime: '',
    guestCount: 1,
    specialRequests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.eventDate = 'Event date must be in the future';
      }
    }

    if (formData.guestCount < 1) {
      newErrors.guestCount = 'At least 1 guest is required';
    } else if (formData.guestCount > venue.capacity) {
      newErrors.guestCount = `Maximum capacity is ${venue.capacity} guests`;
    }

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const booking = await createBooking({
        venueId: venue.id,
        eventDate: formData.eventDate,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        guestCount: formData.guestCount,
        specialRequests: formData.specialRequests || undefined
      });

      toast.success('Booking request sent successfully!');
      onSubmit(booking.id);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const totalPrice = venue.price_per_day || venue.price_per_event || venue.price_per_hour || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Book {venue.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Event Date *
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.eventDate ? 'border-red-500' : ''}
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="guestCount" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Number of Guests *
                </Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  max={venue.capacity}
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 1)}
                  className={errors.guestCount ? 'border-red-500' : ''}
                />
                {errors.guestCount && (
                  <p className="text-red-500 text-sm mt-1">{errors.guestCount}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Max capacity: {venue.capacity}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Start Time (Optional)
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endTime">End Time (Optional)</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className={errors.endTime ? 'border-red-500' : ''}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">{totalPrice} DA</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Price includes venue rental. Additional services may apply.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Processing...' : 'Send Booking Request'}
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

export default BookingForm;
