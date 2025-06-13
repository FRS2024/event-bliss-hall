
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Venue } from '@/types';
import BookingForm from '@/components/booking/BookingForm';
import ContactForm from '@/components/messaging/ContactForm';
import { toast } from 'sonner';

interface VenueActionsProps {
  venue: Venue;
}

const VenueActions: React.FC<VenueActionsProps> = ({ venue }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please sign in to book a venue');
      navigate('/login');
      return;
    }

    if (user.id === venue.hostId) {
      toast.error('You cannot book your own venue');
      return;
    }

    setShowBookingForm(true);
  };

  const handleContactHost = () => {
    if (!user) {
      toast.error('Please sign in to contact the host');
      navigate('/login');
      return;
    }

    if (user.id === venue.hostId) {
      toast.error('You cannot contact yourself');
      return;
    }

    setShowContactForm(true);
  };

  const handleBookingSuccess = (bookingId: string) => {
    setShowBookingForm(false);
    toast.success('Booking request sent! The host will review and respond soon.');
    // Optionally navigate to bookings page
    navigate('/dashboard/bookings');
  };

  const handleContactSuccess = (conversationId: string) => {
    setShowContactForm(false);
    toast.success('Message sent! You can continue the conversation in your messages.');
    // Navigate to the conversation
    navigate(`/dashboard/messages/${conversationId}`);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          className="flex-1 bg-blush-500 hover:bg-blush-600"
          onClick={handleBookNow}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book Now
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="flex-1"
          onClick={handleContactHost}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Contact Host
        </Button>
      </div>

      {showBookingForm && (
        <BookingForm
          venue={venue}
          onSubmit={handleBookingSuccess}
          onCancel={() => setShowBookingForm(false)}
        />
      )}

      {showContactForm && (
        <ContactForm
          venue={venue}
          onSubmit={handleContactSuccess}
          onCancel={() => setShowContactForm(false)}
        />
      )}
    </>
  );
};

export default VenueActions;
