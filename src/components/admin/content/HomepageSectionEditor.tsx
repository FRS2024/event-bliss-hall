import React, { useState, useEffect } from 'react';
import { useUpdateHomepageSection, HomepageSection, HeroContent, StatsContent, HowItWorksContent, CTAContent } from '@/hooks/useHomepageSections';
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
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface HomepageSectionEditorProps {
  section: HomepageSection;
  open: boolean;
  onClose: () => void;
}

const HomepageSectionEditor: React.FC<HomepageSectionEditorProps> = ({ section, open, onClose }) => {
  const updateSection = useUpdateHomepageSection();
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setTitle(section.title || '');
    setSubtitle(section.subtitle || '');
    setContent(section.content || {});
  }, [section]);

  const handleSave = async () => {
    try {
      await updateSection.mutateAsync({
        id: section.id,
        title: title || null,
        subtitle: subtitle || null,
        content,
      });
      toast.success('Section updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update section');
    }
  };

  const renderHeroEditor = () => {
    const heroContent = content as unknown as HeroContent;
    const categories = heroContent.categories || [];

    return (
      <div className="space-y-4">
        <div>
          <Label>Category Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((cat, index) => (
              <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                <Input
                  value={cat}
                  onChange={(e) => {
                    const updated = [...categories];
                    updated[index] = e.target.value;
                    setContent({ ...content, categories: updated });
                  }}
                  className="h-6 w-24 text-xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => {
                    setContent({ ...content, categories: categories.filter((_, i) => i !== index) });
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setContent({ ...content, categories: [...categories, ''] })}
            >
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsEditor = () => {
    const statsContent = content as unknown as StatsContent;
    const items = statsContent.items || [];

    return (
      <div className="space-y-4">
        <Label>Statistics</Label>
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-3 flex items-center gap-2">
              <Input
                value={item.value}
                onChange={(e) => {
                  const updated = [...items];
                  updated[index] = { ...updated[index], value: e.target.value };
                  setContent({ ...content, items: updated });
                }}
                placeholder="500+"
                className="w-24"
              />
              <Input
                value={item.label}
                onChange={(e) => {
                  const updated = [...items];
                  updated[index] = { ...updated[index], label: e.target.value };
                  setContent({ ...content, items: updated });
                }}
                placeholder="Premium Venues"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setContent({ ...content, items: items.filter((_, i) => i !== index) })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setContent({ ...content, items: [...items, { value: '', label: '' }] })}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Statistic
        </Button>
      </div>
    );
  };

  const renderHowItWorksEditor = () => {
    const howContent = content as unknown as HowItWorksContent;
    const steps = howContent.steps || [];

    return (
      <div className="space-y-4">
        <Label>Steps</Label>
        {steps.map((step, index) => (
          <Card key={index}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-muted-foreground">#{step.number}</span>
                <Input
                  value={step.title}
                  onChange={(e) => {
                    const updated = [...steps];
                    updated[index] = { ...updated[index], title: e.target.value };
                    setContent({ ...content, steps: updated });
                  }}
                  placeholder="Step title"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setContent({ ...content, steps: steps.filter((_, i) => i !== index) })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={step.description}
                onChange={(e) => {
                  const updated = [...steps];
                  updated[index] = { ...updated[index], description: e.target.value };
                  setContent({ ...content, steps: updated });
                }}
                placeholder="Step description"
                rows={2}
              />
            </CardContent>
          </Card>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setContent({ 
            ...content, 
            steps: [...steps, { number: steps.length + 1, title: '', description: '' }] 
          })}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Step
        </Button>
      </div>
    );
  };

  const renderCTAEditor = () => {
    const ctaContent = content as unknown as CTAContent;

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={ctaContent.buttonText || ''}
            onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
            placeholder="Become a Host"
          />
        </div>
        <div>
          <Label htmlFor="buttonLink">Button Link</Label>
          <Input
            id="buttonLink"
            value={ctaContent.buttonLink || ''}
            onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
            placeholder="/signup"
          />
        </div>
      </div>
    );
  };

  const renderContentEditor = () => {
    switch (section.section_key) {
      case 'hero':
        return renderHeroEditor();
      case 'stats':
        return renderStatsEditor();
      case 'how-it-works':
        return renderHowItWorksEditor();
      case 'cta':
        return renderCTAEditor();
      default:
        return (
          <div className="text-muted-foreground text-sm">
            No specific editor for this section type.
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="capitalize">
            Edit: {section.section_key.replace(/-/g, ' ')}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Section title"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Section subtitle"
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Section Content</h4>
              {renderContentEditor()}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={updateSection.isPending}>
            {updateSection.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HomepageSectionEditor;
