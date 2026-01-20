import React, { useState } from 'react';
import { useFAQs, useUpdateFAQ, useDeleteFAQ, FAQ, FAQ_CATEGORIES } from '@/hooks/useFAQs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Edit, Trash2, Plus, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import FAQModal from './FAQModal';
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

const FAQManagement: React.FC = () => {
  const { data: faqs, isLoading } = useFAQs();
  const updateFAQ = useUpdateFAQ();
  const deleteFAQ = useDeleteFAQ();
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateFAQ.mutateAsync({ id, is_published: !currentStatus });
      toast.success(`FAQ ${!currentStatus ? 'published' : 'unpublished'}`);
    } catch (error) {
      toast.error('Failed to update FAQ');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteFAQ.mutateAsync(deletingId);
      toast.success('FAQ deleted');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  const filteredFAQs = faqs?.filter(
    faq => activeCategory === 'all' || faq.category === activeCategory
  );

  const groupedFAQs = filteredFAQs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add FAQ
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {FAQ_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4">
          {Object.entries(groupedFAQs || {}).map(([category, categoryFaqs]) => (
            <Card key={category} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg capitalize flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {FAQ_CATEGORIES.find(c => c.value === category)?.label || category}
                  <Badge variant="secondary">{categoryFaqs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {categoryFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <div className="flex items-center gap-2">
                        <AccordionTrigger className="flex-1 text-left">
                          <span className={!faq.is_published ? 'opacity-50' : ''}>
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <div className="flex items-center gap-2 pr-4">
                          {!faq.is_published && (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          <Switch
                            checked={faq.is_published}
                            onCheckedChange={() => handleTogglePublish(faq.id, faq.is_published)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFAQ(faq);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingId(faq.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}

          {(!filteredFAQs || filteredFAQs.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              No FAQs found. Click "Add FAQ" to create one.
            </div>
          )}
        </TabsContent>
      </Tabs>

      <FAQModal
        faq={editingFAQ}
        open={!!editingFAQ || isCreating}
        onClose={() => {
          setEditingFAQ(null);
          setIsCreating(false);
        }}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
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

export default FAQManagement;
