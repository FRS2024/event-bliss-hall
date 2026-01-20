import React, { useState, useEffect } from 'react';
import { useCreateTestimonial, useUpdateTestimonial, Testimonial } from '@/hooks/useTestimonials';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface TestimonialModalProps {
  testimonial: Testimonial | null;
  open: boolean;
  onClose: () => void;
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ testimonial, open, onClose }) => {
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'Guest',
    venue_name: '',
    quote: '',
    rating: 5,
    avatar_url: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        venue_name: testimonial.venue_name || '',
        quote: testimonial.quote,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar_url || '',
        is_featured: testimonial.is_featured,
        is_active: testimonial.is_active,
        display_order: testimonial.display_order,
      });
    } else {
      setFormData({
        name: '',
        role: 'Guest',
        venue_name: '',
        quote: '',
        rating: 5,
        avatar_url: '',
        is_featured: false,
        is_active: true,
        display_order: 0,
      });
    }
  }, [testimonial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        venue_name: formData.venue_name || null,
        avatar_url: formData.avatar_url || null,
      };

      if (testimonial) {
        await updateTestimonial.mutateAsync({ id: testimonial.id, ...data });
        toast.success('Testimonial updated');
      } else {
        await createTestimonial.mutateAsync(data);
        toast.success('Testimonial created');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save testimonial');
    }
  };

  const isLoading = createTestimonial.isPending || updateTestimonial.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Guest">Guest</SelectItem>
                  <SelectItem value="Host">Host</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="venue_name">Venue Name (optional)</Label>
            <Input
              id="venue_name"
              value={formData.venue_name}
              onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
              placeholder="e.g., Garden Pavilion"
            />
          </div>

          <div>
            <Label htmlFor="quote">Quote *</Label>
            <Textarea
              id="quote"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="What did they say about EasyHall?"
              rows={3}
              required
            />
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
            <Input
              id="avatar_url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : testimonial ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialModal;
