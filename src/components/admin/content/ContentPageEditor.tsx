import React, { useState, useEffect } from 'react';
import { useContentPages, useUpdateContentPage, ContentSection } from '@/hooks/useContentPages';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface ContentPageEditorProps {
  pageId: string;
  open: boolean;
  onClose: () => void;
}

const ContentPageEditor: React.FC<ContentPageEditorProps> = ({ pageId, open, onClose }) => {
  const { data: pages } = useContentPages();
  const updatePage = useUpdateContentPage();
  
  const page = pages?.find(p => p.id === pageId);
  
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [sections, setSections] = useState<ContentSection[]>([]);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setMetaDescription(page.meta_description || '');
      setSections(Array.isArray(page.content) ? page.content : []);
    }
  }, [page]);

  const handleAddSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, field: keyof ContentSection, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSections(updated);
  };

  const handleSave = async () => {
    try {
      await updatePage.mutateAsync({
        id: pageId,
        title,
        meta_description: metaDescription || null,
        content: sections,
      });
      toast.success('Page updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update page');
    }
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit: {page.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Page title"
                />
              </div>
              <div>
                <Label htmlFor="meta">Meta Description (SEO)</Label>
                <Textarea
                  id="meta"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Brief description for search engines..."
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Content Sections</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSection}>
                  <Plus className="h-4 w-4 mr-1" /> Add Section
                </Button>
              </div>

              {sections.map((section, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMoveSection(index, 'up')}
                          disabled={index === 0}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1 space-y-3">
                        <Input
                          value={section.title}
                          onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
                          placeholder="Section title"
                        />
                        <Textarea
                          value={section.content}
                          onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
                          placeholder="Section content..."
                          rows={4}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleRemoveSection(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No sections yet. Click "Add Section" to create content.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={updatePage.isPending}>
            {updatePage.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPageEditor;
