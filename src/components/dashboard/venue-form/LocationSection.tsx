
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ALGERIA_CITIES } from '@/constants/venue';
import { VenueFormData } from '@/types/venue-form';

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
              <SelectValue placeholder="Select city" />
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
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            {...register('address', { required: 'Address is required' })}
            placeholder="Enter venue address"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude (Optional)</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
              placeholder="e.g., 36.7538"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude (Optional)</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
              placeholder="e.g., 3.0588"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
