
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AllUsers from './AllUsers';
import HostUsers from './HostUsers';
import GuestUsers from './GuestUsers';
import UserAnalytics from './UserAnalytics';
import { UserVerification } from './UserVerification';

const AdminUsers: React.FC = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<AllUsers />} />
        <Route path="hosts" element={<HostUsers />} />
        <Route path="guests" element={<GuestUsers />} />
        <Route path="verification" element={<UserVerification />} />
        <Route path="analytics" element={<UserAnalytics />} />
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    </div>
  );
};

export default AdminUsers;
