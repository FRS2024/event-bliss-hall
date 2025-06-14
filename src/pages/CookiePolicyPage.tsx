
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicyPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="page-container max-w-4xl">
        <div className="mb-8">
          <h1 className="section-title">Cookie Policy</h1>
          <p className="text-center text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. What Are Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and store some information about your preferences or past actions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Essential Cookies</h4>
                  <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
                </div>
                <div>
                  <h4 className="font-semibold">Analytics Cookies</h4>
                  <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                </div>
                <div>
                  <h4 className="font-semibold">Functional Cookies</h4>
                  <p>These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We may use third-party services that place cookies on your device, including:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Google Analytics for website analytics</li>
                <li>Payment processors for secure transactions</li>
                <li>Authentication services for account management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc pl-6 mt-2">
                <li>Browser settings: Most browsers allow you to refuse cookies or alert you when cookies are being sent</li>
                <li>Opt-out tools: Some third-party services provide opt-out mechanisms</li>
                <li>Mobile settings: Mobile devices may have settings to limit ad tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Impact of Disabling Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Disabling cookies may impact your experience on our website. Some features may not work correctly, and you may need to re-enter information more frequently. Essential cookies cannot be disabled as they are necessary for the website to function.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us through our contact page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CookiePolicyPage;
