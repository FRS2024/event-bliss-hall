
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import AddVenueForm from './AddVenueForm';
import BookingsManagement from './BookingsManagement';
import MessagesView from './MessagesView';
import DashboardSettings from './DashboardSettings';

const DashboardContent: React.FC = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="add-venue" element={<AddVenueForm />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="messages" element={<MessagesView />} />
        <Route path="settings" element={<DashboardSettings />} />
      </Routes>
    </div>
  );
};

export default DashboardContent;
