import React, { useState } from 'react';
import { useTestimonials, useUpdateTestimonial, useDeleteTestimonial, Testimonial } from '@/hooks/useTestimonials';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import TestimonialModal from './TestimonialModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const TestimonialsManagement: React.FC = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateTestimonial.mutateAsync({ id, is_active: !currentStatus });
      toast.success(`Testimonial ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update testimonial');
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await updateTestimonial.mutateAsync({ id, is_featured: !currentStatus });
      toast.success(`Testimonial ${!currentStatus ? 'featured' : 'unfeatured'}`);
    } catch (error) {
      toast.error('Failed to update testimonial');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTestimonial.mutateAsync(deletingId);
      toast.success('Testimonial deleted');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <div className="grid gap-4">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className={!testimonial.is_active ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar_url || undefined} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{testimonial.name}</span>
                    <Badge variant="outline">{testimonial.role}</Badge>
                    {testimonial.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                  </div>
                  {testimonial.venue_name && (
                    <p className="text-sm text-muted-foreground">{testimonial.venue_name}</p>
                  )}
                  <blockquote className="text-muted-foreground italic my-2">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Active</span>
                    <Switch
                      checked={testimonial.is_active}
                      onCheckedChange={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Featured</span>
                    <Switch
                      checked={testimonial.is_featured}
                      onCheckedChange={() => handleToggleFeatured(testimonial.id, testimonial.is_featured)}
                    />
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTestimonial(testimonial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeletingId(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {testimonials?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No testimonials yet. Click "Add Testimonial" to create one.
          </div>
        )}
      </div>

      <TestimonialModal
        testimonial={editingTestimonial}
        open={!!editingTestimonial || isCreating}
        onClose={() => {
          setEditingTestimonial(null);
          setIsCreating(false);
        }}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestimonialsManagement;
