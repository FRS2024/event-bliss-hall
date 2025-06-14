
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import SmartAvatar from '@/components/ui/smart-avatar';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName?: string;
  onAvatarUpdate: (url: string | null) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userName = '',
  onAvatarUpdate
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);

  React.useEffect(() => {
    setPreviewUrl(currentAvatarUrl);
  }, [currentAvatarUrl]);

  const invalidateAllQueries = async () => {
    console.log('🔄 Starting complete query invalidation...');
    
    // Clear all profile-related queries from cache
    await queryClient.cancelQueries({ queryKey: ['profile'] });
    await queryClient.cancelQueries({ queryKey: ['user-profile'] });
    
    // Remove cached data
    queryClient.removeQueries({ queryKey: ['profile', user?.id] });
    queryClient.removeQueries({ queryKey: ['user-profile', user?.id] });
    
    // Force fresh fetch
    await queryClient.invalidateQueries({ queryKey: ['profile'] });
    await queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    
    // Wait a moment for cache to clear
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['profile', user?.id] });
    }, 100);
    
    console.log('✅ Query invalidation complete');
  };

  const generateUniqueFileName = (originalName: string) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExt = originalName.split('.').pop();
    return `avatar_${timestamp}_${randomId}.${fileExt}`;
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return;
    }

    setUploading(true);
    
    try {
      console.log('📤 Starting avatar upload for user:', user.id);
      console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });
      
      // Generate unique filename to avoid caching issues
      const uniqueFileName = generateUniqueFileName(file.name);
      const filePath = `${user.id}/${uniqueFileName}`;

      console.log('📂 Upload path:', filePath);

      // Delete existing avatar files if they exist
      if (currentAvatarUrl) {
        try {
          const urlParts = currentAvatarUrl.split('/');
          const oldFileName = urlParts[urlParts.length - 1];
          const oldPath = `${user.id}/${oldFileName}`;
          
          console.log('🗑️ Attempting to delete old avatar:', oldPath);
          
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([oldPath]);
            
          if (deleteError) {
            console.warn('⚠️ Could not delete old avatar (might not exist):', deleteError);
          } else {
            console.log('✅ Old avatar deleted successfully');
          }
        } catch (error) {
          console.warn('⚠️ Error during old avatar cleanup:', error);
        }
      }

      // Upload new avatar
      console.log('📤 Uploading new avatar...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: false, // Don't overwrite, use unique names
          contentType: file.type 
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ File uploaded successfully:', uploadData);

      // Get public URL with cache-busting parameter
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Add cache-busting parameter
      const cacheBustedUrl = `${publicUrl}?v=${Date.now()}`;
      console.log('🔗 Generated public URL:', cacheBustedUrl);

      // Wait a moment to ensure file is fully uploaded
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update profile with new avatar URL
      console.log('💾 Updating profile with new avatar URL...');
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: cacheBustedUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw updateError;
      }

      console.log('✅ Profile updated successfully:', updateData);

      // Update local state immediately
      setPreviewUrl(cacheBustedUrl);
      onAvatarUpdate(cacheBustedUrl);
      
      // Wait before invalidating cache to ensure database is updated
      setTimeout(async () => {
        await invalidateAllQueries();
      }, 250);
      
      toast.success('Avatar updated successfully! 🎉');
      console.log('✅ Avatar upload complete');
      
    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error);
      toast.error(`Failed to upload avatar: ${error.message}`);
      
      // Reset preview on error
      setPreviewUrl(currentAvatarUrl);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user || !currentAvatarUrl) return;

    setUploading(true);
    
    try {
      console.log('🗑️ Removing avatar for user:', user.id);
      
      // Delete from storage
      try {
        const urlParts = currentAvatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0]; // Remove cache-busting params
        const filePath = `${user.id}/${fileName}`;
        
        console.log('🗑️ Deleting avatar file:', filePath);
        
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);
          
        if (deleteError) {
          console.warn('⚠️ Could not delete avatar file:', deleteError);
        } else {
          console.log('✅ Avatar file deleted successfully');
        }
      } catch (error) {
        console.warn('⚠️ Error during avatar file deletion:', error);
      }

      // Update profile
      console.log('💾 Updating profile to remove avatar URL...');
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw updateError;
      }

      console.log('✅ Profile updated successfully:', updateData);

      // Update local state immediately
      setPreviewUrl(null);
      onAvatarUpdate(null);
      
      // Wait before invalidating cache
      setTimeout(async () => {
        await invalidateAllQueries();
      }, 250);
      
      toast.success('Avatar removed successfully! 🗑️');
      console.log('✅ Avatar removal complete');
      
    } catch (error: any) {
      console.error('❌ Error removing avatar:', error);
      toast.error(`Failed to remove avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File selected:', file.name, file.size, file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    uploadAvatar(file);
    
    // Clear input to allow same file to be selected again
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SmartAvatar
            src={previewUrl}
            alt="Profile avatar"
            fallbackText={userName}
            size="xl"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="text-white text-xs">...</div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="avatar-upload" className="sr-only">
            Upload avatar
          </Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            
            {previewUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeAvatar}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
          
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500">
            PNG, JPG up to 5MB
          </p>
          
          {uploading && (
            <p className="text-xs text-blue-600">
              Processing upload...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
