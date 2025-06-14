
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import BasicInformationSection from './venue-form/BasicInformationSection';
import LocationSection from './venue-form/LocationSection';
import PricingSection from './venue-form/PricingSection';
import FeaturesSection from './venue-form/FeaturesSection';
import EditImagesSection from './venue-form/EditImagesSection';

interface VenueFormData {
  name: string;
  description: string;
  capacity: number;
  city: string;
  address: string;
  category: string;
  eventTypes: string[];
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
  latitude?: number;
  longitude?: number;
}

const EditVenueForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<VenueFormData>({
    defaultValues: {
      eventTypes: []
    }
  });

  // Fetch venue data
  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue', id],
    queryFn: async () => {
      if (!id) throw new Error('Venue ID is required');
      
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          venue_images (
            id,
            image_url,
            is_primary
          ),
          venue_features (
            feature_name
          )
        `)
        .eq('id', id)
        .eq('host_id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user?.id
  });

  // Populate form when venue data is loaded
  useEffect(() => {
    if (venue) {
      reset({
        name: venue.name,
        description: venue.description,
        capacity: venue.capacity,
        city: venue.city,
        address: venue.address,
        category: venue.category,
        eventTypes: venue.event_types || [],
        pricePerHour: venue.price_per_hour || undefined,
        pricePerDay: venue.price_per_day || undefined,
        pricePerEvent: venue.price_per_event || undefined,
        latitude: venue.latitude || undefined,
        longitude: venue.longitude || undefined,
      });
      
      setSelectedFeatures(venue.venue_features?.map(f => f.feature_name) || []);
    }
  }, [venue, reset]);

  // Register required fields
  React.useEffect(() => {
    register('city', { required: 'City is required' });
    register('category', { required: 'Category is required' });
    register('eventTypes', { required: 'Please select at least one event type' });
    register('latitude');
    register('longitude');
  }, [register]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const updateVenueMutation = useMutation({
    mutationFn: async (data: VenueFormData) => {
      if (!id) throw new Error('Venue ID is required');

      // Update venue basic information
      const { error: venueError } = await supabase
        .from('venues')
        .update({
          name: data.name,
          description: data.description,
          capacity: Number(data.capacity),
          city: data.city,
          address: data.address,
          category: data.category,
          event_types: data.eventTypes,
          price_per_hour: data.pricePerHour ? Number(data.pricePerHour) : null,
          price_per_day: data.pricePerDay ? Number(data.pricePerDay) : null,
          price_per_event: data.pricePerEvent ? Number(data.pricePerEvent) : null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (venueError) throw venueError;

      // Update features
      // First, delete existing features
      await supabase
        .from('venue_features')
        .delete()
        .eq('venue_id', id);

      // Then insert new features
      if (selectedFeatures.length > 0) {
        const { error: featuresError } = await supabase
          .from('venue_features')
          .insert(
            selectedFeatures.map(feature => ({
              venue_id: id,
              feature_name: feature,
            }))
          );

        if (featuresError) throw featuresError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue', id] });
      queryClient.invalidateQueries({ queryKey: ['host-venues'] });
      toast.success('Venue updated successfully!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.error('Error updating venue:', error);
      toast.error(error.message || 'Failed to update venue. Please try again.');
    }
  });

  const onSubmit = async (data: VenueFormData) => {
    if (!user) {
      toast.error('You must be logged in to update a venue');
      return;
    }

    if (!data.city) {
      toast.error('Please select a city');
      return;
    }

    if (!data.category) {
      toast.error('Please select a category');
      return;
    }

    if (!data.eventTypes || data.eventTypes.length === 0) {
      toast.error('Please select at least one event type');
      return;
    }

    setIsSubmitting(true);
    updateVenueMutation.mutate(data);
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Authentication Required</h1>
          <p className="text-gray-600 dark:text-gray-400">Please log in to edit this venue</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-8">
          <div className="text-lg">Loading venue...</div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Venue Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The venue you're looking for doesn't exist or you don't have permission to edit it.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Venue</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your venue information and settings</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <BasicInformationSection 
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />

        <LocationSection 
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />

        <PricingSection register={register} />

        <FeaturesSection 
          selectedFeatures={selectedFeatures}
          onFeatureToggle={handleFeatureToggle}
        />

        <EditImagesSection 
          venueId={id!}
          images={venue.venue_images || []}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || updateVenueMutation.isPending}>
            {isSubmitting || updateVenueMutation.isPending ? 'Updating...' : 'Update Venue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditVenueForm;
