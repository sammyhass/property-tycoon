import LoginComponent from '@/components/Login';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/games');
    }
  }, [isAuthenticated]);

  return (
    <AdminLayout>
      <LoginComponent />
    </AdminLayout>
  );
}
