
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ALGERIA_CITIES } from '@/constants/venue';

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

interface LocationSectionProps {
  register: UseFormRegister<VenueFormData>;
  errors: FieldErrors<VenueFormData>;
  setValue: UseFormSetValue<VenueFormData>;
  watch: UseFormWatch<VenueFormData>;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  register,
  errors,
  setValue,
  watch
}) => {
  const selectedCity = watch('city');

  return (
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
  );
};

export default LocationSection;
