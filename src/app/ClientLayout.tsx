'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AppLayout from '@/components/Layout/AppLayout';

const authPaths = ['/login', '/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authPaths.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}
