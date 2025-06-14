
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import AddVenueForm from './AddVenueForm';
import BookingsManagement from './BookingsManagement';
import MessagesView from './MessagesView';
import DashboardSettings from './DashboardSettings';
import VenueAvailability from './VenueAvailability';
import { useUserRole } from '@/hooks/useUserRole';

const DashboardContent: React.FC = () => {
  const userRole = useUserRole();

  if (userRole === 'loading') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const HostOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (userRole !== 'host') {
      return <Navigate to="/dashboard/bookings" replace />;
    }
    return <>{children}</>;
  };

  const getDefaultRoute = () => {
    return userRole === 'host' ? <DashboardOverview /> : <Navigate to="/dashboard/bookings" replace />;
  };

  return (
    <div className="p-6">
      <Routes>
        <Route index element={getDefaultRoute()} />
        <Route 
          path="add-venue" 
          element={
            <HostOnlyRoute>
              <AddVenueForm />
            </HostOnlyRoute>
          } 
        />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="messages/*" element={<MessagesView />} />
        <Route 
          path="venues/:venueId/availability" 
          element={
            <HostOnlyRoute>
              <VenueAvailability />
            </HostOnlyRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <HostOnlyRoute>
              <DashboardSettings />
            </HostOnlyRoute>
          } 
        />
      </Routes>
    </div>
  );
};

export default DashboardContent;
