import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ALGERIA_CITIES = [
  'Algiers', 'Oran', 'Constantine', 'Batna', 'Djelfa', 'Setif', 'Annaba', 'Sidi Bel Abbes',
  'Biskra', 'Tebessa', 'El Oued', 'Skikda', 'Tiaret', 'Bejaia', 'Tlemcen', 'Ouargla',
  'Blida', 'Bouira', 'Tarf', 'Tindouf', 'Tissemsilt', 'El Bayadh', 'Khenchela', 'Mila',
  'Ain Defla', 'Naama', 'Ain Temouchent', 'Ghardaia', 'Relizane', 'Tizi Ouzou', 'Mascara',
  'Ouled Djellal', 'Bordj Bou Arreridj', 'Boumerdes', 'El Tarf', 'Jijel', 'Laghouat',
  'Oum El Bouaghi', 'Saida', 'Souk Ahras', 'Tipaza', 'Medea', 'Mostaganem', 'MSila',
  'Chlef', 'Adrar', 'Illizi', 'Tamanghasset'
];

const VENUE_FEATURES = [
  'Air Conditioning', 'Wi-Fi', 'Parking', 'Catering Kitchen', 'Sound System', 
  'Projector/Screen', 'Stage/Platform', 'Dance Floor', 'Bar Area', 'Outdoor Space',
  'Photography Studio', 'Bridal Suite', 'Security System', 'Wheelchair Accessible',
  'Valet Parking', 'Garden/Terrace', 'Pool', 'Gym/Fitness Center'
];

interface VenueFormData {
  name: string;
  description: string;
  capacity: number;
  city: string;
  address: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
}

const AddVenueForm: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VenueFormData>();

  const selectedCity = watch('city');

  // Ensure the city field is properly registered
  React.useEffect(() => {
    register('city', { required: 'City is required' });
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

    setIsSubmitting(true);
    try {
      console.log('Creating venue for user:', user.id);

      // Create venue
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: data.name,
          description: data.description,
          capacity: Number(data.capacity),
          city: data.city,
          address: data.address,
          host_id: user.id,
          price_per_hour: data.pricePerHour ? Number(data.pricePerHour) : null,
          price_per_day: data.pricePerDay ? Number(data.pricePerDay) : null,
          price_per_event: data.pricePerEvent ? Number(data.pricePerEvent) : null,
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

      toast.success('Venue created successfully!');
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
        <p className="text-gray-600 dark:text-gray-400">Create a new venue listing</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Venue Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Venue name is required' })}
                placeholder="Enter venue name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your venue's unique features and ambiance"
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                {...register('capacity', { required: 'Capacity is required', min: 1 })}
                placeholder="Number of guests"
              />
              {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Select onValueChange={(value) => setValue('city', value)} value={selectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a city in Algeria" />
                </SelectTrigger>
                <SelectContent>
                  {ALGERIA_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                {...register('address', { required: 'Address is required' })}
                placeholder="Enter the complete address"
                rows={2}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pricePerHour">Price per Hour (DA)</Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  step="0.01"
                  {...register('pricePerHour')}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="pricePerDay">Price per Day (DA)</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  step="0.01"
                  {...register('pricePerDay')}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="pricePerEvent">Price per Event (DA)</Label>
                <Input
                  id="pricePerEvent"
                  type="number"
                  step="0.01"
                  {...register('pricePerEvent')}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features & Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {VENUE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm">{feature}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="images">Upload Images (Max 8)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="text-blush-500 hover:text-blush-600">Upload images</span>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blush-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
