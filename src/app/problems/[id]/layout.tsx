'use client';

import ProblemNavbar from '@/components/problems/tabs/shared/problem-navbar';
import { useApp } from '@/contexts/app-context';
import { useParams, usePathname, useRouter } from 'next/navigation';

export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shouldHideNavigation } = useApp();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const problemId = params.id as string;

  // Extract active tab from pathname
  const activeTab = pathname.split('/').pop() || 'problem';

  const handleTabChange = (tab: string) => {
    router.push(`/problems/${problemId}/${tab}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Problem Navigation */}
      <ProblemNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hideNavigation={shouldHideNavigation}
      />

      {/* Main Content - Full Width for all tabs */}
      <div className="container mx-auto px-4 bg-white dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}
