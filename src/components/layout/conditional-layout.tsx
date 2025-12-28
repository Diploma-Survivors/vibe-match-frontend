"use client";

import { Footer, Header } from "@/components/layout";
import { useApp } from "@/contexts/app-context";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shouldHideNavigation, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (shouldHideNavigation) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Local mode OR Moodle mode on non-dedicated pages - show full layout
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}
