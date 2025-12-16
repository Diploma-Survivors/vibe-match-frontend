'use client';

import ProblemNavbar from '@/components/problems/tabs/problem-navbar';
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
  const lastSegment = pathname.split('/').pop() || '';
  const validTabs = ['description', 'submissions', 'solutions', 'standing'];
  const activeTab = validTabs.includes(lastSegment)
    ? lastSegment
    : 'description';

  const handleTabChange = (tab: string) => {
    router.push(`/problems/${problemId}/${tab}`);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-slate-900">
      {/* Problem Navigation */}
      <div className="flex-none">
        <ProblemNavbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hideNavigation={shouldHideNavigation}
        />
      </div>

      {/* Main Content - Full Width for all tabs */}
      <div className="flex-1 min-h-0 w-full bg-slate-50 dark:bg-slate-900 p-1.5">
        {children}
      </div>
    </div>
  );
}
