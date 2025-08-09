"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Code,
  FileText,
  TestTube,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface ProblemNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "problem", label: "Problem", icon: FileText },
  { id: "submit", label: "Submit", icon: Code },
  { id: "status", label: "Status", icon: CheckCircle },
  { id: "standing", label: "Standing", icon: Trophy },
  { id: "test", label: "Test", icon: TestTube },
];

export default function ProblemNavbar({
  activeTab,
  onTabChange,
}: ProblemNavbarProps) {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          <Link href="/problems">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Problems
            </Button>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`gap-2 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Placeholder for future actions */}
          <div className="w-20" />
        </div>
      </div>
    </nav>
  );
}
