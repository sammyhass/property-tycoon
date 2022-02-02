import LoginComponent from '@/components/Login';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import React from 'react';

export default function LoginPage() {
  return (
    <AdminLayout>
      <LoginComponent />
    </AdminLayout>
  );
}
