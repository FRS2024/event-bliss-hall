import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { FolderPlus, Save } from 'lucide-react';

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    display_order: number;
  } | null;
}

const colorOptions = [
  { value: 'bg-pink-100 text-pink-800', label: 'Pink' },
  { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
  { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
  { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
  { value: 'bg-green-100 text-green-800', label: 'Green' },
  { value: 'bg-teal-100 text-teal-800', label: 'Teal' },
  { value: 'bg-gray-100 text-gray-800', label: 'Gray' },
  { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo' },
  { value: 'bg-red-100 text-red-800', label: 'Red' },
  { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
];

const iconOptions = [
  'Heart', 'Presentation', 'PartyPopper', 'UtensilsCrossed', 
  'Building', 'Trees', 'Briefcase', 'Landmark', 'Star', 'Music',
];

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onOpenChange,
  category,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!category;
  
  const [name, setName] = React.useState(category?.name || '');
  const [description, setDescription] = React.useState(category?.description || '');
  const [icon, setIcon] = React.useState(category?.icon || 'Star');
  const [color, setColor] = React.useState(category?.color || 'bg-gray-100 text-gray-800');
  const [displayOrder, setDisplayOrder] = React.useState(category?.display_order || 0);

  React.useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setIcon(category.icon || 'Star');
      setColor(category.color || 'bg-gray-100 text-gray-800');
      setDisplayOrder(category.display_order);
    } else {
      resetForm();
    }
  }, [category, open]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('Star');
    setColor('bg-gray-100 text-gray-800');
    setDisplayOrder(0);
  };

  const saveCategoryMutation = useMutation({
    mutationFn: async () => {
      const categoryData = {
        name,
        description: description || null,
        icon,
        color,
        display_order: displayOrder,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && category) {
        const { error } = await supabase
          .from('venue_categories')
          .update(categoryData)
          .eq('id', category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('venue_categories')
          .insert(categoryData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-venue-categories'] });
      toast({
        title: isEditing ? 'Category Updated' : 'Category Created',
        description: `The category "${name}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: error.message?.includes('unique') 
          ? 'A category with this name already exists.'
          : 'Failed to save category. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a category name.',
        variant: 'destructive',
      });
      return;
    }
    saveCategoryMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            {isEditing ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Wedding Hall"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      {iconName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((colorOption) => (
                    <SelectItem key={colorOption.value} value={colorOption.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${colorOption.value.split(' ')[0]}`} />
                        {colorOption.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first in the list.
            </p>
          </div>

          {/* Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-xs text-muted-foreground">Preview</Label>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                {name || 'Category Name'}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveCategoryMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
