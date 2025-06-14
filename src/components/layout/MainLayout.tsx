
import React from 'react';
import EnhancedHeader from './EnhancedHeader';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30 dark:bg-gray-900">
      <EnhancedHeader />
      <main className="flex-grow pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
