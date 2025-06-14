
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { VENUE_FEATURES } from '@/constants/venue';

interface FeaturesSectionProps {
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  selectedFeatures,
  onFeatureToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Available Features</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {VENUE_FEATURES.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={feature}
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={() => onFeatureToggle(feature)}
              />
              <Label htmlFor={feature} className="text-sm font-normal">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesSection;
