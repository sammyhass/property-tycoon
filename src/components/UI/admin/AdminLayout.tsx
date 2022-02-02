import React from 'react';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
