
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <h1 className="section-title">Privacy Policy</h1>
          <p className="text-center text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We collect information you provide directly to us, such as when you create an account, list a venue, make a booking, or contact us. This includes:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Personal information (name, email address, phone number)</li>
                <li>Venue information and photos</li>
                <li>Booking and payment information</li>
                <li>Communications with hosts and guests</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>With venue hosts when you make a booking</li>
                <li>With service providers who perform services on our behalf</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a merger, sale, or asset transfer</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                If you have any questions about this Privacy Policy, please contact us through our contact page or email us directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
