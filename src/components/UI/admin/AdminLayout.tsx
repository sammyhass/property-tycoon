import Head from 'next/head';
import React from 'react';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Property Tycoon Admin</title>
      </Head>
      <div>
        <AdminNavbar />
        {children}
      </div>
    </>
  );
}
