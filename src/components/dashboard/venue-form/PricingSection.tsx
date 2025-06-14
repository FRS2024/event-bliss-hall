
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface PricingSectionProps {
  register: UseFormRegister<VenueFormData>;
}

const PricingSection: React.FC<PricingSectionProps> = ({ register }) => {
  return (
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
  );
};

export default PricingSection;
