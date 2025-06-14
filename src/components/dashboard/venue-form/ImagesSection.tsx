
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

interface ImagesSectionProps {
  images: File[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
  images,
  onImageUpload,
  onRemoveImage
}) => {
  return (
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
                  onChange={onImageUpload}
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
                  onClick={() => onRemoveImage(index)}
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
  );
};

export default ImagesSection;
