
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Delete existing avatar if it exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setPreviewUrl(publicUrl);
      onAvatarUpdate(publicUrl);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user || !currentAvatarUrl) return;

    setUploading(true);
    
    try {
      // Delete from storage
      const fileName = currentAvatarUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${fileName}`]);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      setPreviewUrl(null);
      onAvatarUpdate(null);
      toast.success('Avatar removed successfully!');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
