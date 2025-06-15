
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VenuePendingApproval from './VenuePendingApproval';
import ActiveVenues from './ActiveVenues';
import FlaggedVenues from './FlaggedVenues';
import VenueCategories from './VenueCategories';

const AdminVenues: React.FC = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<Navigate to="pending" replace />} />
        <Route path="pending" element={<VenuePendingApproval />} />
        <Route path="active" element={<ActiveVenues />} />
        <Route path="flagged" element={<FlaggedVenues />} />
        <Route path="categories" element={<VenueCategories />} />
        <Route path="*" element={<Navigate to="pending" replace />} />
      </Routes>
    </div>
  );
};

export default AdminVenues;
