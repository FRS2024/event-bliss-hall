import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CategoryModal from '../modals/CategoryModal';
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
import { Switch } from '@/components/ui/switch';

interface VenueCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean | null;
  display_order: number | null;
  venue_count: number | null;
  created_at: string | null;
}

const VenueCategories: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VenueCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<VenueCategory | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['venue-categories-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venue_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Get venue counts per category
      const { data: venues } = await supabase
        .from('venues')
        .select('category');

      const countMap = new Map<string, number>();
      venues?.forEach(v => {
        countMap.set(v.category, (countMap.get(v.category) || 0) + 1);
      });

      return data?.map(cat => ({
        ...cat,
        venue_count: countMap.get(cat.name) || 0
      })) as VenueCategory[];
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('venue_categories')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-categories-admin'] });
      toast({ title: 'Category updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update category', variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('venue_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-categories-admin'] });
      toast({ title: 'Category deleted' });
      setDeletingCategory(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    }
  });

  const handleEdit = (category: VenueCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeCategories = categories?.filter(c => c.is_active) || [];
  const inactiveCategories = categories?.filter(c => !c.is_active) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Venue Categories</h1>
          <p className="text-muted-foreground">Manage venue categories and classifications</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{categories?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{activeCategories.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-muted-foreground">{inactiveCategories.length}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Card key={category.id} className={!category.is_active ? 'opacity-60' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={category.is_active ?? true}
                  onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: category.id, isActive: checked })}
                />
                <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDeletingCategory(category)}
                  disabled={(category.venue_count ?? 0) > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
              )}
              <div className="flex items-center justify-between">
                <Badge className={category.color || 'bg-gray-100 text-gray-800'}>
                  {category.venue_count} venues
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {category.icon && <span>{category.icon}</span>}
                  <span>Order: {category.display_order}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Categories Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first venue category to get started.</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Category Modal */}
      <CategoryModal
        open={isModalOpen}
        onOpenChange={(open) => { if (!open) handleCloseModal(); }}
        category={editingCategory}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
              {(deletingCategory?.venue_count ?? 0) > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  This category has {deletingCategory?.venue_count} venues and cannot be deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
              disabled={(deletingCategory?.venue_count ?? 0) > 0 || deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VenueCategories;
