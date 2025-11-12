'use client';

import ContestNavbar from '@/components/contest/contest-navbar';
import { useApp } from '@/contexts/app-context';
import { useParams, usePathname, useRouter } from 'next/navigation';

export default function ContestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shouldHideNavigation } = useApp();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const contestId = params.id as string;

  // Extract active tab from pathname
  const activeTab = pathname.split('/').pop() || 'description';

  const handleTabChange = (tab: string) => {
    router.push(`/contests/${contestId}/${tab}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Contest Navigation */}
      <ContestNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hideNavigation={shouldHideNavigation}
      />

      {/* Main Content - Full Width for all tabs */}
      <div className="container mx-auto px-4 dark:bg-slate-900">{children}</div>
    </div>
  );
}
