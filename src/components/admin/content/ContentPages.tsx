import React, { useState } from 'react';
import { useContentPages, useUpdateContentPage, useDeleteContentPage } from '@/hooks/useContentPages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ContentPageEditor from './ContentPageEditor';
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

const ContentPages: React.FC = () => {
  const { data: pages, isLoading } = useContentPages();
  const updatePage = useUpdateContentPage();
  const deletePage = useDeleteContentPage();
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [deletingPage, setDeletingPage] = useState<string | null>(null);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updatePage.mutateAsync({ id, is_published: !currentStatus });
      toast.success(`Page ${!currentStatus ? 'published' : 'unpublished'}`);
    } catch (error) {
      toast.error('Failed to update page status');
    }
  };

  const handleDelete = async () => {
    if (!deletingPage) return;
    try {
      await deletePage.mutateAsync(deletingPage);
      toast.success('Page deleted');
      setDeletingPage(null);
    } catch (error) {
      toast.error('Failed to delete page');
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
        <h1 className="text-2xl font-bold">Content Pages</h1>
      </div>

      <div className="grid gap-4">
        {pages?.map((page) => (
          <Card key={page.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <Badge variant={page.is_published ? 'default' : 'secondary'}>
                    {page.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={page.is_published}
                    onCheckedChange={() => handleTogglePublish(page.id, page.is_published)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(`/${page.slug}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPage(page.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeletingPage(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Slug: <code className="bg-muted px-1 rounded">/{page.slug}</code></p>
                <p>Sections: {Array.isArray(page.content) ? page.content.length : 0}</p>
                <p>Last updated: {format(new Date(page.updated_at), 'PPp')}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPage && (
        <ContentPageEditor
          pageId={editingPage}
          open={!!editingPage}
          onClose={() => setEditingPage(null)}
        />
      )}

      <AlertDialog open={!!deletingPage} onOpenChange={() => setDeletingPage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
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

export default ContentPages;
