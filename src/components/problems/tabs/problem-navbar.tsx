'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Code,
  FileText,
  Lightbulb,
  TestTube,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';

interface ProblemNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hideNavigation?: boolean;
}

const navItems = [
  { id: 'description', label: 'Problem', icon: FileText },
  { id: 'submissions', label: 'Submissions', icon: CheckCircle },
  { id: 'solutions', label: 'Solutions', icon: Lightbulb },
  { id: 'standing', label: 'Standing', icon: Trophy },
];

export default function ProblemNavbar({
  activeTab,
  onTabChange,
  hideNavigation = false,
}: ProblemNavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Button - only show if hideNavigation is false */}
          {!hideNavigation && (
            <Link href="/problems">
              <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400 pl-0 hover:bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Trở về danh sách
                </Button>
              </motion.div>
            </Link>
          )}

          {/* If hideNavigation is true, render an empty div to maintain layout */}
          {hideNavigation && <div className="w-20" />}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-green-500
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-problem-tab"
                      className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
                      transition={{
                        type: 'spring',
                        bounce: 0.25,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <motion.span
                    className="relative z-10 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.div>
                    {item.label}
                  </motion.span>
                </button>
              );
            })}
          </div>

          {/* Placeholder for future actions */}
          <div className="w-20" />
        </div>
      </div>
    </motion.nav>
  );
}
