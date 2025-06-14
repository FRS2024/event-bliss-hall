
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <h1 className="section-title">Terms of Service</h1>
          <p className="text-center text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                By accessing or using EasyHall's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Permission is granted to temporarily use EasyHall's services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Venue Listing Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Venue hosts agree to provide accurate and up-to-date information about their properties. All venue listings must:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Include accurate descriptions and pricing</li>
                <li>Provide real and recent photographs</li>
                <li>Maintain current availability calendars</li>
                <li>Respond to booking inquiries within 24 hours</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Booking and Cancellation</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                All bookings are subject to host approval. Cancellation policies vary by venue and are clearly stated in each listing. Refund eligibility depends on the timing of cancellation and the venue's specific policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                EasyHall processes payments securely through third-party payment providers. Service fees and taxes may apply to all transactions. Full payment terms are disclosed before booking confirmation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Liability Limitations</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                EasyHall acts as a platform connecting venue hosts and guests. We are not responsible for the quality, safety, or legality of venues listed, the truth or accuracy of listings, or the ability of hosts to rent their venues.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                For questions about these Terms of Service, please contact us through our contact page or email us directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfServicePage;
