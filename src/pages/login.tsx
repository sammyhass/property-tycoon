import LoginComponent from '@/components/Login';
import AdminLayout from '@/components/UI/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <AdminLayout>
      <LoginComponent />
    </AdminLayout>
  );
}
