
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface UnavailabilityFormProps {
  date: string;
  onSubmit: (data: UnavailabilityData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export interface UnavailabilityData {
  isExteriorBooking: boolean;
  guestFullName?: string;
  guestPhone?: string;
  guestEmail?: string;
  notes?: string;
}

const UnavailabilityForm: React.FC<UnavailabilityFormProps> = ({
  date,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState<UnavailabilityData>({
    isExteriorBooking: false,
    guestFullName: '',
    guestPhone: '',
    guestEmail: '',
    notes: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof UnavailabilityData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (formData.isExteriorBooking) {
      if (!formData.guestFullName?.trim()) {
        newErrors.guestFullName = 'Guest full name is required for exterior bookings';
      }
      if (!formData.guestPhone?.trim()) {
        newErrors.guestPhone = 'Guest phone number is required for exterior bookings';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mark Date Unavailable</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Date: {date}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExteriorBooking"
                checked={formData.isExteriorBooking}
                onCheckedChange={(checked) => 
                  handleInputChange('isExteriorBooking', checked as boolean)
                }
              />
              <Label htmlFor="isExteriorBooking">
                This is an exterior booking (made outside the site)
              </Label>
            </div>

            {formData.isExteriorBooking && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium">Guest Information</h4>
                
                <div>
                  <Label htmlFor="guestFullName">
                    Guest Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="guestFullName"
                    value={formData.guestFullName}
                    onChange={(e) => handleInputChange('guestFullName', e.target.value)}
                    placeholder="Enter guest's full name"
                    className={errors.guestFullName ? 'border-red-500' : ''}
                  />
                  {errors.guestFullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.guestFullName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="guestPhone">
                    Guest Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="guestPhone"
                    value={formData.guestPhone}
                    onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                    placeholder="Enter guest's phone number"
                    className={errors.guestPhone ? 'border-red-500' : ''}
                  />
                  {errors.guestPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.guestPhone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="guestEmail">
                    Guest Email <span className="text-gray-500">(recommended)</span>
                  </Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                    placeholder="Enter guest's email"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information"
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : 'Mark Unavailable'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnavailabilityForm;
