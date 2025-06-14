
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import BasicInformationSection from './venue-form/BasicInformationSection';
import LocationSection from './venue-form/LocationSection';
import PricingSection from './venue-form/PricingSection';
import FeaturesSection from './venue-form/FeaturesSection';
import ImagesSection from './venue-form/ImagesSection';

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

const AddVenueForm: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VenueFormData>({
    defaultValues: {
      eventTypes: []
    }
  });

  // Ensure the required fields are properly registered
  React.useEffect(() => {
    register('city', { required: 'City is required' });
    register('category', { required: 'Category is required' });
    register('eventTypes', { required: 'Please select at least one event type' });
    register('latitude');
    register('longitude');
  }, [register]);

  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to create a venue');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 8)); // Max 8 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const onSubmit = async (data: VenueFormData) => {
    console.log('Form submitted with data:', data);
    
    if (!user) {
      toast.error('You must be logged in to create a venue');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
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
    try {
      console.log('Creating venue for user:', user.id);

      // Create venue with coordinates and event types
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: data.name,
          description: data.description,
          capacity: Number(data.capacity),
          city: data.city,
          address: data.address,
          category: data.category,
          event_types: data.eventTypes,
          host_id: user.id,
          price_per_hour: data.pricePerHour ? Number(data.pricePerHour) : null,
          price_per_day: data.pricePerDay ? Number(data.pricePerDay) : null,
          price_per_event: data.pricePerEvent ? Number(data.pricePerEvent) : null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
        })
        .select()
        .single();

      if (venueError) {
        console.error('Venue creation error:', venueError);
        throw new Error(venueError.message || 'Failed to create venue');
      }

      console.log('Venue created successfully:', venue);

      // Upload images
      const imageUploadPromises = images.map(async (file, i) => {
        const fileName = `${user.id}/${venue.id}/${Date.now()}_${i}_${file.name}`;
        
        console.log('Uploading image:', fileName);

        const { error: uploadError } = await supabase.storage
          .from('venue-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('venue-images')
          .getPublicUrl(fileName);

        // Save image record
        const { error: imageRecordError } = await supabase
          .from('venue_images')
          .insert({
            venue_id: venue.id,
            image_url: publicUrl,
            is_primary: i === 0, // First image is primary
          });

        if (imageRecordError) {
          console.error('Image record error:', imageRecordError);
          throw new Error(`Failed to save image record: ${imageRecordError.message}`);
        }
      });

      await Promise.all(imageUploadPromises);

      // Add features
      if (selectedFeatures.length > 0) {
        const { error: featuresError } = await supabase
          .from('venue_features')
          .insert(
            selectedFeatures.map(feature => ({
              venue_id: venue.id,
              feature_name: feature,
            }))
          );

        if (featuresError) {
          console.error('Features error:', featuresError);
          throw new Error(`Failed to save features: ${featuresError.message}`);
        }
      }

      toast.success('Venue created successfully with event types and location data!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating venue:', error);
      toast.error(error.message || 'Failed to create venue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Authentication Required</h1>
          <p className="text-gray-600 dark:text-gray-400">Please log in to create a venue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Venue</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new venue listing with precise location and event types</p>
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

        <ImagesSection 
          images={images}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Venue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddVenueForm;
