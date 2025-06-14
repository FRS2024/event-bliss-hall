
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VenueFormData } from '@/types/venue-form';

interface PricingSectionProps {
  register: UseFormRegister<VenueFormData>;
}

const PricingSection: React.FC<PricingSectionProps> = ({ register }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pricePerHour">Price per Hour (DZD)</Label>
          <Input
            id="pricePerHour"
            type="number"
            {...register('pricePerHour', { valueAsNumber: true })}
            placeholder="Enter hourly rate"
          />
        </div>

        <div>
          <Label htmlFor="pricePerDay">Price per Day (DZD)</Label>
          <Input
            id="pricePerDay"
            type="number"
            {...register('pricePerDay', { valueAsNumber: true })}
            placeholder="Enter daily rate"
          />
        </div>

        <div>
          <Label htmlFor="pricePerEvent">Price per Event (DZD)</Label>
          <Input
            id="pricePerEvent"
            type="number"
            {...register('pricePerEvent', { valueAsNumber: true })}
            placeholder="Enter event rate"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;
