'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type WorkspaceTab = 
  | 'dashboard'
  | 'verdict-scanner'
  | 'market-regime'
  | 'news-intelligent'
  | 'flow-derivatives'
  | 'economic-calendar';

const TABS: { id: WorkspaceTab; label: string; href: string }[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/' },
  { id: 'verdict-scanner', label: 'Verdict Scanner', href: '/verdict-scanner' },
  { id: 'market-regime', label: 'Market Regime', href: '/market-regime' },
  { id: 'news-intelligent', label: 'News Intelligent', href: '/news-intelligent' },
  { id: 'flow-derivatives', label: 'Flow Derivatives', href: '/flow-derivatives' },
  { id: 'economic-calendar', label: 'Economic Calendar', href: '/economic-calendar' },
];

export default function WorkspaceTabs() {
  const pathname = usePathname();
  
  const getActiveTab = (): WorkspaceTab => {
    for (const tab of TABS) {
      if (pathname === tab.href || pathname.startsWith(tab.href + '/')) {
        return tab.id;
      }
    }
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <nav className="workspace-tabs" role="tablist" aria-label="Workspace sections">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`workspace-tab ${activeTab === tab.id ? 'active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}