import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from '@/pages/UserManagement';
import Users from '@/pages/Users';

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="user-management" replace />} />
      <Route path="user-management" element={<UserManagement />} />
      <Route path="users" element={<Users />} />
      <Route path="*" element={<Navigate to="user-management" replace />} />
    </Routes>
  );
};

export default AdminDashboard;