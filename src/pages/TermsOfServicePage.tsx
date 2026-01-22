
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentPage, ContentSection } from '@/hooks/useContentPages';
import { format } from 'date-fns';

const TermsOfServicePage: React.FC = () => {
  const { data: page, isLoading, error } = useContentPage('terms-of-service');

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
      title: '1. Acceptance of Terms',
      content: 'By accessing or using EasyHall\'s services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily use EasyHall\'s services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
    },
    {
      title: '3. Venue Listing Terms',
      content: 'Venue hosts agree to provide accurate and up-to-date information about their properties. All venue listings must include accurate descriptions, pricing, real photographs, and current availability calendars.'
    },
    {
      title: '4. Booking and Cancellation',
      content: 'All bookings are subject to host approval. Cancellation policies vary by venue and are clearly stated in each listing. Refund eligibility depends on the timing of cancellation and the venue\'s specific policy.'
    },
    {
      title: '5. Payment Terms',
      content: 'EasyHall processes payments securely through third-party payment providers. Service fees and taxes may apply to all transactions. Full payment terms are disclosed before booking confirmation.'
    },
    {
      title: '6. Liability Limitations',
      content: 'EasyHall acts as a platform connecting venue hosts and guests. We are not responsible for the quality, safety, or legality of venues listed, the truth or accuracy of listings, or the ability of hosts to rent their venues.'
    },
    {
      title: '7. Contact Information',
      content: 'For questions about these Terms of Service, please contact us through our contact page or email us directly.'
    }
  ];

  const content = page?.content || fallbackContent;
  const lastUpdated = page?.updated_at ? format(new Date(page.updated_at), 'MMMM d, yyyy') : new Date().toLocaleDateString();

  return (
    <MainLayout>
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <h1 className="section-title">{page?.title || 'Terms of Service'}</h1>
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

export default TermsOfServicePage;
