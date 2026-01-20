import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { usePublishedFAQs, FAQ_CATEGORIES } from '@/hooks/useFAQs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: faqs, isLoading } = usePublishedFAQs();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs?.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedFAQs = filteredFAQs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blush-100 dark:bg-blush-900/50 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-blush-500" />
            </div>
            <h1 className="font-serif text-4xl font-bold mb-2">{t('faq.title', 'Frequently Asked Questions')}</h1>
            <p className="text-muted-foreground">
              {t('faq.subtitle', 'Find answers to common questions about EasyHall')}
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('faq.searchPlaceholder', 'Search FAQs...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="w-full justify-start mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="all">{t('faq.categories.all', 'All')}</TabsTrigger>
              {FAQ_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {t(`faq.categories.${cat.value}`, cat.label)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory}>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : filteredFAQs && filteredFAQs.length > 0 ? (
                <div className="space-y-6">
                  {activeCategory === 'all' ? (
                    Object.entries(groupedFAQs || {}).map(([category, categoryFaqs]) => (
                      <div key={category}>
                        <h2 className="font-semibold text-lg mb-3 capitalize text-blush-600 dark:text-blush-400">
                          {FAQ_CATEGORIES.find(c => c.value === category)?.label || category}
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                          {categoryFaqs?.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <AccordionTrigger className="text-left hover:text-blush-500">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left hover:text-blush-500">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {searchQuery 
                    ? t('faq.noResults', 'No FAQs match your search.')
                    : t('faq.noFAQs', 'No FAQs available.')
                  }
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
