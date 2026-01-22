
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentPage, ContentSection } from '@/hooks/useContentPages';
import { format } from 'date-fns';

const CookiePolicyPage: React.FC = () => {
  const { data: page, isLoading, error } = useContentPage('cookie-policy');

  if (isLoading) {
    return (
      <MainLayout>
        <div className="page-container max-w-4xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Fallback content if database content is not available
  const fallbackContent: ContentSection[] = [
    {
      title: '1. What Are Cookies',
      content: 'Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and store some information about your preferences or past actions.'
    },
    {
      title: '2. Types of Cookies We Use',
      content: 'We use Essential Cookies (necessary for the website to function properly), Analytics Cookies (help us understand how visitors interact with our website), and Functional Cookies (enable enhanced functionality and personalization).'
    },
    {
      title: '3. Third-Party Cookies',
      content: 'We may use third-party services that place cookies on your device, including Google Analytics for website analytics, payment processors for secure transactions, and authentication services for account management.'
    },
    {
      title: '4. Managing Your Cookie Preferences',
      content: 'You can control and manage cookies through browser settings (most browsers allow you to refuse cookies), opt-out tools (some third-party services provide opt-out mechanisms), and mobile settings (mobile devices may have settings to limit ad tracking).'
    },
    {
      title: '5. Impact of Disabling Cookies',
      content: 'Disabling cookies may impact your experience on our website. Some features may not work correctly, and you may need to re-enter information more frequently. Essential cookies cannot be disabled as they are necessary for the website to function.'
    },
    {
      title: '6. Updates to This Policy',
      content: 'We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.'
    },
    {
      title: '7. Contact Us',
      content: 'If you have any questions about our use of cookies or this Cookie Policy, please contact us through our contact page.'
    }
  ];

  const content = page?.content || fallbackContent;
  const lastUpdated = page?.updated_at ? format(new Date(page.updated_at), 'MMMM d, yyyy') : new Date().toLocaleDateString();

  return (
    <MainLayout>
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <h1 className="section-title">{page?.title || 'Cookie Policy'}</h1>
          <p className="text-center text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-6">
          {content.map((section: ContentSection, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicyPage;
