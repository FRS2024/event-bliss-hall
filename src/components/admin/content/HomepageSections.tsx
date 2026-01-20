import React, { useState } from 'react';
import { useHomepageSections, useUpdateHomepageSection, HomepageSection } from '@/hooks/useHomepageSections';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Layout, Type, BarChart3, HelpCircle, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import HomepageSectionEditor from './HomepageSectionEditor';

const sectionIcons: Record<string, React.ReactNode> = {
  hero: <Layout className="h-5 w-5" />,
  stats: <BarChart3 className="h-5 w-5" />,
  'how-it-works': <HelpCircle className="h-5 w-5" />,
  cta: <Megaphone className="h-5 w-5" />,
};

const sectionDescriptions: Record<string, string> = {
  hero: 'Main banner section with title, subtitle, and category links',
  stats: 'Platform statistics displayed in a bar format',
  'how-it-works': 'Step-by-step guide showing how the platform works',
  cta: 'Call-to-action section for host signup',
};

const HomepageSections: React.FC = () => {
  const { data: sections, isLoading } = useHomepageSections();
  const updateSection = useUpdateHomepageSection();
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateSection.mutateAsync({ id, is_active: !currentStatus });
      toast.success(`Section ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update section');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Homepage Sections</h1>
          <p className="text-muted-foreground">Manage content displayed on the homepage</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections?.map((section) => (
          <Card key={section.id} className={!section.is_active ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {sectionIcons[section.section_key] || <Type className="h-5 w-5" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg capitalize">
                      {section.section_key.replace(/-/g, ' ')}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {sectionDescriptions[section.section_key]}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={section.is_active ? 'default' : 'secondary'}>
                  {section.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.title && (
                  <div>
                    <span className="text-xs text-muted-foreground">Title:</span>
                    <p className="text-sm font-medium truncate">{section.title}</p>
                  </div>
                )}
                {section.subtitle && (
                  <div>
                    <span className="text-xs text-muted-foreground">Subtitle:</span>
                    <p className="text-sm text-muted-foreground truncate">{section.subtitle}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Updated: {format(new Date(section.updated_at), 'PP')}
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={section.is_active}
                      onCheckedChange={() => handleToggleActive(section.id, section.is_active)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSection(section)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingSection && (
        <HomepageSectionEditor
          section={editingSection}
          open={!!editingSection}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  );
};

export default HomepageSections;
