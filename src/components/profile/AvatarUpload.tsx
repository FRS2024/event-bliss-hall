
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

  const invalidateAllQueries = () => {
    // Invalidate all profile-related queries to ensure fresh data everywhere
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    
    // Force refetch of the current user's profile
    queryClient.refetchQueries({ queryKey: ['profile', user?.id] });
    
    console.log('🔄 All profile queries invalidated and refetched');
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return;
    }

    setUploading(true);
    
    try {
      console.log('📤 Starting avatar upload for user:', user.id);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Delete existing avatar if it exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop();
        if (oldPath) {
          console.log('🗑️ Deleting old avatar:', `${user.id}/${oldPath}`);
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      console.log('📤 Uploading new avatar to:', filePath);
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('🔗 Avatar uploaded, public URL:', publicUrl);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        throw updateError;
      }

      // Update local state immediately
      setPreviewUrl(publicUrl);
      onAvatarUpdate(publicUrl);
      
      // Optimistically update the query cache
      queryClient.setQueryData(['profile', user.id], (oldData: any) => {
        if (oldData) {
          return { ...oldData, avatar_url: publicUrl };
        }
        return oldData;
      });
      
      // Invalidate and refetch all related queries
      invalidateAllQueries();
      
      toast.success('Avatar updated successfully! 🎉');
      console.log('✅ Avatar upload complete and cache updated');
    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error);
      toast.error(`Failed to upload avatar: ${error.message}`);
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
      const fileName = currentAvatarUrl.split('/').pop();
      if (fileName) {
        console.log('🗑️ Deleting avatar file:', `${user.id}/${fileName}`);
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${fileName}`]);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Profile update error:', error);
        throw error;
      }

      // Update local state immediately
      setPreviewUrl(null);
      onAvatarUpdate(null);
      
      // Optimistically update the query cache
      queryClient.setQueryData(['profile', user.id], (oldData: any) => {
        if (oldData) {
          return { ...oldData, avatar_url: null };
        }
        return oldData;
      });
      
      // Invalidate and refetch all related queries
      invalidateAllQueries();
      
      toast.success('Avatar removed successfully! 🗑️');
      console.log('✅ Avatar removal complete and cache updated');
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
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <SmartAvatar
          src={previewUrl}
          alt="Profile avatar"
          fallbackText={userName}
          size="xl"
        />
        
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
          
          {previewUrl && (
            <p className="text-xs text-gray-400">
              Current: {previewUrl.slice(-30)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
