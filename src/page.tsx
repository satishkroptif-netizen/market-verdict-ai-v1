'use client';

import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/SearchDropdown';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import DashboardContent from '@/components/DashboardContent';

export const dynamic = 'force-dynamic';

export default function Home() {
  return <DashboardContent />;
}
