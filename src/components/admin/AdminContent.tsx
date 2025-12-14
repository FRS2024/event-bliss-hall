
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import AdminUsers from './users/AdminUsers';
import AdminVenues from './venues/AdminVenues';
import AdminBookings from './bookings/AdminBookings';
import AdminModeration from './moderation/AdminModeration';
import AdminAnalytics from './analytics/AdminAnalytics';
import AdminCommunications from './communications/AdminCommunications';
import AdminSettings from './settings/AdminSettings';
import { BulkOperations } from './operations/BulkOperations';
import { RealTimeActivityFeed } from './activity/RealTimeActivityFeed';

const AdminContent: React.FC = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="users/*" element={<AdminUsers />} />
        <Route path="venues/*" element={<AdminVenues />} />
        <Route path="bookings/*" element={<AdminBookings />} />
        <Route path="moderation/*" element={<AdminModeration />} />
        <Route path="analytics/*" element={<AdminAnalytics />} />
        <Route path="communications/*" element={<AdminCommunications />} />
        <Route path="settings/*" element={<AdminSettings />} />
        <Route path="operations" element={<BulkOperations />} />
        <Route path="activity" element={<RealTimeActivityFeed />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminContent;
