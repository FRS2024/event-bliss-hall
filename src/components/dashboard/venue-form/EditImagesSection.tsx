
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Star, StarOff, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface VenueImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

interface EditImagesSectionProps {
  venueId: string;
  images: VenueImage[];
}

const EditImagesSection: React.FC<EditImagesSectionProps> = ({ venueId, images: initialImages }) => {
  const [images, setImages] = useState<VenueImage[]>(initialImages);
  const [uploadingImages, setUploadingImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const uploadImagesMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (!user) throw new Error('Not authenticated');
      
      const uploadPromises = files.map(async (file) => {
        const fileName = `${user.id}/${venueId}/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('venue-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('venue-images')
          .getPublicUrl(fileName);

        const { data, error: recordError } = await supabase
          .from('venue_images')
          .insert({
            venue_id: venueId,
            image_url: publicUrl,
            is_primary: images.length === 0, // First image becomes primary if no images exist
          })
          .select()
          .single();

        if (recordError) throw recordError;
        return data;
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: (newImages) => {
      setImages(prev => [...prev, ...newImages]);
      setUploadingImages([]);
      queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    },
    onError: (error: any) => {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.');
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const imageToDelete = images.find(img => img.id === imageId);
      if (!imageToDelete) throw new Error('Image not found');

      // Delete from storage
      const path = imageToDelete.image_url.split('/').pop();
      if (path) {
        await supabase.storage
          .from('venue-images')
          .remove([path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('venue_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      return imageId;
    },
    onSuccess: (deletedImageId) => {
      const deletedImage = images.find(img => img.id === deletedImageId);
      const remainingImages = images.filter(img => img.id !== deletedImageId);
      
      // If we deleted the primary image and there are other images, make the first one primary
      if (deletedImage?.is_primary && remainingImages.length > 0) {
        setPrimaryImageMutation.mutate(remainingImages[0].id);
      }
      
      setImages(remainingImages);
      queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
      toast.success('Image deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  });

  const setPrimaryImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      // First, unset all primary flags for this venue
      await supabase
        .from('venue_images')
        .update({ is_primary: false })
        .eq('venue_id', venueId);

      // Then set the selected image as primary
      const { error } = await supabase
        .from('venue_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;
      return imageId;
    },
    onSuccess: (primaryImageId) => {
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === primaryImageId
      })));
      queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
      toast.success('Primary image updated');
    },
    onError: (error: any) => {
      console.error('Error setting primary image:', error);
      toast.error('Failed to set primary image. Please try again.');
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 8 - images.length;
    
    if (files.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more image(s). Maximum 8 images allowed.`);
      return;
    }

    setUploadingImages(files);
    setIsUploading(true);
    uploadImagesMutation.mutate(files);
    setIsUploading(false);
  };

  const handleDeleteImage = (imageId: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImageMutation.mutate(imageId);
    }
  };

  const handleSetPrimary = (imageId: string) => {
    setPrimaryImageMutation.mutate(imageId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Images ({images.length}/8)</span>
          {images.length < 8 && (
            <Label htmlFor="image-upload" className="cursor-pointer">
              <Button type="button" size="sm" disabled={isUploading}>
                <Upload className="h-4 w-4 mr-1" />
                {isUploading ? 'Uploading...' : 'Add Images'}
              </Button>
              <Input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </Label>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {images.length === 0 && uploadingImages.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-500 mb-4">Upload some images to showcase your venue</p>
            <Label htmlFor="image-upload-empty" className="cursor-pointer">
              <Button type="button">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
              <Input
                id="image-upload-empty"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </Label>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <img
                    src={image.image_url}
                    alt="Venue"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <Button
                        type="button"
                        size="icon"
                        variant={image.is_primary ? "default" : "secondary"}
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={setPrimaryImageMutation.isPending}
                        title={image.is_primary ? 'Primary image' : 'Set as primary'}
                        className="h-8 w-8"
                      >
                        {image.is_primary ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={deleteImageMutation.isPending}
                        title="Delete image"
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
            
            {uploadingImages.map((file, index) => (
              <div key={`uploading-${index}`} className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          <p>• Upload up to 8 images (PNG, JPG, GIF up to 10MB each)</p>
          <p>• Click the star icon to set an image as primary</p>
          <p>• The primary image will be displayed as the main venue photo</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditImagesSection;
