
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AllBookings from './AllBookings';
import BookingDisputes from './BookingDisputes';
import BookingRevenue from './BookingRevenue';
import BookingAnalytics from './BookingAnalytics';

const AdminBookings: React.FC = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<AllBookings />} />
        <Route path="disputes" element={<BookingDisputes />} />
        <Route path="revenue" element={<BookingRevenue />} />
        <Route path="analytics" element={<BookingAnalytics />} />
        <Route path="*" element={<Navigate to="/admin/bookings" replace />} />
      </Routes>
    </div>
  );
};

export default AdminBookings;
