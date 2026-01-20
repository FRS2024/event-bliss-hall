import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ContentPages from './ContentPages';
import TestimonialsManagement from './TestimonialsManagement';
import FAQManagement from './FAQManagement';
import HomepageSections from './HomepageSections';

const AdminContentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="pages" replace />} />
      <Route path="pages" element={<ContentPages />} />
      <Route path="testimonials" element={<TestimonialsManagement />} />
      <Route path="faqs" element={<FAQManagement />} />
      <Route path="homepage" element={<HomepageSections />} />
      <Route path="*" element={<Navigate to="pages" replace />} />
    </Routes>
  );
};

export default AdminContentRoutes;
