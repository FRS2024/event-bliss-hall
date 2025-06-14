
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VENUE_CATEGORIES } from '@/constants/venue';

interface VenueFormData {
  name: string;
  description: string;
  capacity: number;
  city: string;
  address: string;
  category: string;
  pricePerHour?: number;
  pricePerDay?: number;
  pricePerEvent?: number;
}

interface BasicInformationSectionProps {
  register: UseFormRegister<VenueFormData>;
  errors: FieldErrors<VenueFormData>;
  setValue: UseFormSetValue<VenueFormData>;
  watch: UseFormWatch<VenueFormData>;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  register,
  errors,
  setValue,
  watch
}) => {
  const selectedCategory = watch('category');

  return (
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
          <Label htmlFor="category">Category *</Label>
          <Select onValueChange={(value) => setValue('category', value)} value={selectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select venue category" />
            </SelectTrigger>
            <SelectContent>
              {VENUE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
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
  );
};

export default BasicInformationSection;
