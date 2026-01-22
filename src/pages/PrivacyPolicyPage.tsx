
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentPage, ContentSection } from '@/hooks/useContentPages';
import { format } from 'date-fns';

const PrivacyPolicyPage: React.FC = () => {
  const { data: page, isLoading, error } = useContentPage('privacy-policy');

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
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, list a venue, make a booking, or contact us. This includes personal information (name, email address, phone number), venue information and photos, booking and payment information, and communications with hosts and guests.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, process transactions and send related information, send technical notices and support messages, communicate with you about products, services, and events, and monitor and analyze trends and usage.'
    },
    {
      title: '3. Information Sharing',
      content: 'We may share your information with venue hosts when you make a booking, with service providers who perform services on our behalf, when required by law or to protect our rights, and in connection with a merger, sale, or asset transfer.'
    },
    {
      title: '4. Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.'
    },
    {
      title: '5. Your Rights',
      content: 'You have the right to access and update your personal information, request deletion of your data, object to processing of your data, request data portability, and withdraw consent at any time.'
    },
    {
      title: '6. Cookies and Tracking',
      content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.'
    },
    {
      title: '7. Contact Us',
      content: 'If you have any questions about this Privacy Policy, please contact us through our contact page or email us directly.'
    }
  ];

  const content = page?.content || fallbackContent;
  const lastUpdated = page?.updated_at ? format(new Date(page.updated_at), 'MMMM d, yyyy') : new Date().toLocaleDateString();

  return (
    <MainLayout>
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <h1 className="section-title">{page?.title || 'Privacy Policy'}</h1>
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

export default PrivacyPolicyPage;
